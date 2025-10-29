import json
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Test bot by sending message directly
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response with test result
    '''
    
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        chat_id = params.get('chat_id', '')
        
        if not chat_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'error': 'Укажите chat_id в параметрах',
                    'example': '?chat_id=YOUR_TELEGRAM_ID'
                })
            }
        
        bot_token = '8195491451:AAGiGhu99Nx8Yv5kzw6IbUsKC7Us0896smo'
        web_app_url = "https://t-p73518846-tg-bot-creation.poehali.app"
        
        response_text = (
            "🚀 Добро пожаловать в RocketPay!\n\n"
            "🎁 Бонус 1000₽ на старте\n"
            "💰 Играй в Ракетку и выигрывай\n"
            "💳 Мгновенный вывод средств\n\n"
            "Нажми кнопку ниже, чтобы начать! 👇"
        )
        
        keyboard = {
            'inline_keyboard': [[
                {
                    'text': '🚀 Запустить RocketPay',
                    'web_app': {'url': web_app_url}
                }
            ]]
        }
        
        send_params = {
            'chat_id': chat_id,
            'text': response_text,
            'reply_markup': json.dumps(keyboard)
        }
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        data = urllib.parse.urlencode(send_params).encode('utf-8')
        
        try:
            req = urllib.request.Request(url, data=data)
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode('utf-8'))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Сообщение отправлено!',
                    'telegram_response': result
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
