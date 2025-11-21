import requests
from typing import Dict, Any, Optional
from config import Config

class BlockchainService:
    def __init__(self):
        self.blockchain_url = Config.BLOCKCHAIN_API_URL
        self.timeout = 10
    
    def add_safra(self, safra_data: Dict[str, Any], user_token: str) -> tuple[bool, Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
        try:
            headers = {
                'Authorization': f"Bearer {user_token}",
                'Content-Type': 'application/json'
            }
            response = requests.post(
                f'{self.blockchain_url}/safra',
                json=safra_data,
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code in [201, 200]:
                return True, response.json(), None
            else:
                error_data = response.json()
                error_msg = error_data.get('error', 'Failed to add safra')
                return False, None, {'message': error_msg, 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Blockchain service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Blockchain service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
    
    def get_safra(self, safra_id: str, user_token: str) -> tuple[bool, Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
        try:
            headers = {
                'Authorization': f"Bearer {user_token}",
                'Content-Type': 'application/json'
            }
            response = requests.get(
                f'{self.blockchain_url}/safra/{safra_id}',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                return True, response.json(), None
            elif response.status_code == 404:
                error_data = response.json()
                return False, None, {'message': error_data.get('error', 'Safra not found'), 'status': 404}
            else:
                error_data = response.json()
                error_msg = error_data.get('error', 'Failed to retrieve safra')
                return False, None, {'message': error_msg, 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Blockchain service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Blockchain service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
    
    def get_safra_history(self, safra_id: str, user_token: str) -> tuple[bool, Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
        try:
            headers = {
                'Authorization': f"Bearer {user_token}",
                'Content-Type': 'application/json'
            }
            response = requests.get(
                f'{self.blockchain_url}/safra/{safra_id}/historico',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                return True, response.json(), None
            elif response.status_code == 404:
                error_data = response.json()
                return False, None, {'message': error_data.get('error', 'Safra not found'), 'status': 404}
            else:
                error_data = response.json()
                error_msg = error_data.get('error', 'Failed to retrieve safra history')
                return False, None, {'message': error_msg, 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Blockchain service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Blockchain service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
    
    def validate_blockchain(self, user_token: str) -> tuple[bool, Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
        try:
            headers = {
                'Authorization': f"Bearer {user_token}",
                'Content-Type': 'application/json'
            }
            response = requests.get(
                f'{self.blockchain_url}/valid',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                return True, response.json(), None
            else:
                error_data = response.json()
                return False, None, {'message': error_data.get('error', 'Validation failed'), 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Blockchain service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Blockchain service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
