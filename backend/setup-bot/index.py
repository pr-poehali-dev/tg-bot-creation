import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Setup Telegram bot webhook automatically
    Args: event - dict with httpMethod, body
          context - object with request_id attribute
    Returns: HTTP response dict with setup status
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
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        
        if not bot_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Bot token not configured'})
            }
        
        webhook_url = 'https://functions.poehali.dev/bd28a071-1d18-421e-8b3f-f39c66679732'
        
        params = urllib.parse.urlencode({'url': webhook_url})
        url = f"https://api.telegram.org/bot{bot_token}/setWebhook?{params}"
        
        try:
            req = urllib.request.Request(url)
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode('utf-8'))
            
            bot_info_url = f"https://api.telegram.org/bot{bot_token}/getMe"
            bot_req = urllib.request.Request(bot_info_url)
            bot_response = urllib.request.urlopen(bot_req)
            bot_data = json.loads(bot_response.read().decode('utf-8'))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'webhook_set': result.get('ok', False),
                    'webhook_url': webhook_url,
                    'bot_username': bot_data.get('result', {}).get('username', ''),
                    'bot_name': bot_data.get('result', {}).get('first_name', ''),
                    'message': 'Webhook успешно настроен!'
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
