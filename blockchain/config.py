import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    AUTH_API_URL = os.getenv('AUTH_API_URL', 'http://localhost:3333')