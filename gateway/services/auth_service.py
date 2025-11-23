import requests
from typing import Dict, Any, Optional
from config import Config

class AuthService:
    def __init__(self):
        self.auth_url = Config.AUTH_API_URL
        self.timeout = 10
    
    def login(self, email: str, password: str) -> tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
        try:
            response = requests.post(
                f'{self.auth_url}/auth',
                json={'email': email, 'password': password},
                timeout=self.timeout
            )
            
            if response.status_code == 201:
                data = response.json()
                token = data.get('token')
                return True, token, None
            else:
                error_data = response.json()
                error_msg = error_data.get('message', 'Authentication failed')
                return False, None, {'message': error_msg, 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Auth service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Auth service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
    
    def verify_token(self, token: str) -> tuple[bool, Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
        try:
            response = requests.get(
                f'{self.auth_url}/auth',
                headers={'Authorization': f'Bearer {token}'},
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                return True, data, None
            else:
                return False, None, {'message': 'Token verification failed', 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Auth service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Auth service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
        
    def register(self, name: str, email: str, password: str) -> tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
        try:
            response = requests.post(
                f'{self.auth_url}/users',
                json={'email': email, 'password': password, 'name': name},
                timeout=self.timeout
            )
            
            if response.status_code == 201:
                data = response.json()
                return True, data, None
            else:
                error_data = response.json()
                error_msg = error_data.get('message', 'Registration failed')
                return False, None, {'message': error_msg, 'status': response.status_code}
        except requests.exceptions.Timeout:
            return False, None, {'message': 'Auth service timeout', 'status': 503}
        except requests.exceptions.RequestException as e:
            return False, None, {'message': f'Auth service error: {str(e)}', 'status': 503}
        except Exception as e:
            return False, None, {'message': f'Unexpected error: {str(e)}', 'status': 500}
