import requests
from typing import Dict, Any, Optional
from config import Config

class SummaryService:
    def __init__(self):
        self.summary_url = Config.SUMMARY_API_URL
        self.timeout = 500
    
    def summarize_crop(self, crop_data: Dict[str, Any], user_token: str) -> tuple[bool, Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
        try:
            response = requests.post(
                f'{self.summary_url}/summarize',
                headers={
                    "Authorization": f"Bearer {user_token}"
                },
                json=crop_data,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                return True, response.json(), None
            else:
                error_data = response.json()
                error_msg = error_data.get('error', 'Failed to summarize crop')
                return False, None, {'message': error_msg, 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Summary service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Summary service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
    
    def health_check(self, user_token) -> tuple[bool, Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
        try:
            headers = {
                'Authorization': f"Bearer {user_token}",
                'Content-Type': 'application/json'
            }
            response = requests.get(
                f'{self.summary_url}/health',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                return True, response.json(), None
            else:
                return False, None, {'message': response.json()["error"] or 'Health check failed', 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Summary service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Summary service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
