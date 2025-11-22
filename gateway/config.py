import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    API_GATEWAY_HOST = os.getenv('API_GATEWAY_HOST', '0.0.0.0')
    API_GATEWAY_PORT = int(os.getenv('API_GATEWAY_PORT', 5002))

    WSGI_API_PREFIX = os.getenv('WSGI_API_PREFIX', '/api')
    
    AUTH_API_URL = os.getenv('AUTH_API_URL', 'http://localhost:3333')
    BLOCKCHAIN_API_URL = os.getenv('BLOCKCHAIN_API_URL', 'http://localhost:5001')
    SUMMARY_API_URL = os.getenv('SUMMARY_API_URL', 'http://localhost:5000')

