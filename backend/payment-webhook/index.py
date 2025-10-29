import json
import os
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle payment notifications and credit user balance automatically
    Args: event - dict with httpMethod, body containing payment info
          context - object with request_id attribute
    Returns: HTTP response dict confirming payment processing
    '''
    
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Payment-Signature',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        try:
            import psycopg2
            
            payment_data = json.loads(event.get('body', '{}'))
            
            user_id = payment_data.get('user_id')
            amount = float(payment_data.get('amount', 0))
            payment_phone = payment_data.get('phone', '')
            
            if not user_id or amount <= 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Invalid payment data'})
                }
            
            dsn = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            
            cur.execute(
                "UPDATE users SET real_balance = real_balance + %s, balance = balance + %s, updated_at = %s WHERE user_id = %s",
                (amount, amount, datetime.now(), user_id)
            )
            
            cur.execute(
                "INSERT INTO transactions (user_id, type, amount, description) VALUES (%s, %s, %s, %s)",
                (user_id, 'deposit', amount, f'Пополнение через СБП с {payment_phone}')
            )
            
            conn.commit()
            cur.close()
            conn.close()
            
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
            if bot_token:
                send_telegram_notification(bot_token, user_id, amount)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'amount': amount,
                    'new_balance': amount,
                    'message': 'Баланс успешно пополнен!'
                })
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'status': 'active',
                'payment_phone': '89069892267',
                'bank': 'Озон Банк',
                'method': 'СБП'
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }


def send_telegram_notification(bot_token: str, user_id: int, amount: float):
    import urllib.request
    import urllib.parse
    
    message = f"✅ Пополнение успешно!\n\n💰 Сумма: {amount}₽\n🎮 Можете начать игру!"
    
    params = {
        'chat_id': user_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode(params).encode('utf-8')
    
    req = urllib.request.Request(url, data=data)
    urllib.request.urlopen(req)
