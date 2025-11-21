import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    AUTH_API_URL = os.getenv('AUTH_API_URL', 'http://localhost:3333')
    OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
    OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama2')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
