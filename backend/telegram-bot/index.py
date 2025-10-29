import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Telegram bot webhook handler for RocketPay Mini App
    Args: event - dict with httpMethod, body, headers
          context - object with request_id attribute
    Returns: HTTP response dict with statusCode, headers, body
    '''
    
    method: str = event.get('httpMethod', 'POST')
    
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
    
    if method == 'POST':
        try:
            update = json.loads(event.get('body', '{}'))
            
            if 'message' in update:
                message = update['message']
                chat_id = message['chat']['id']
                text = message.get('text', '')
                
                if text == '/start':
                    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
                    
                    if bot_token:
                        response_text = (
                            "🚀 Добро пожаловать в RocketPay!\n\n"
                            "🎁 Бонус 1000₽ на старте\n"
                            "💰 Играй в Ракетку и выигрывай\n"
                            "💳 Мгновенный вывод средств\n\n"
                            "Нажми кнопку ниже, чтобы начать! 👇"
                        )
                        
                        send_message_with_button(bot_token, chat_id, response_text)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'ok': True})
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


def send_message_with_button(bot_token: str, chat_id: int, text: str):
    import urllib.request
    import urllib.parse
    
    web_app_url = "https://rocketpay.poehali.app"
    
    keyboard = {
        'inline_keyboard': [[
            {
                'text': '🚀 Запустить RocketPay',
                'web_app': {'url': web_app_url}
            }
        ]]
    }
    
    params = {
        'chat_id': chat_id,
        'text': text,
        'reply_markup': json.dumps(keyboard)
    }
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode(params).encode('utf-8')
    
    req = urllib.request.Request(url, data=data)
    urllib.request.urlopen(req)