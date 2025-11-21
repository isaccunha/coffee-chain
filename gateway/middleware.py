import base64
from functools import wraps
from flask import request, jsonify
from jwt import ExpiredSignatureError, InvalidTokenError

import requests
import jwt
from config import Config

PUBLIC_KEY = None

def require_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json',
                'code': 'INVALID_CONTENT_TYPE'
            }), 400
        return f(*args, **kwargs)
    return decorated_function

def get_public_key():
    global PUBLIC_KEY

    if PUBLIC_KEY is None:
        response = requests.get(f"{Config.AUTH_API_URL}/auth/public-key")
        data = response.json()
        PUBLIC_KEY = data["publicKey"] 
        PUBLIC_KEY = base64.b64decode(PUBLIC_KEY).decode("utf-8")
    return PUBLIC_KEY

def require_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({
                "error": "Missing Authorization header",
                "code": "MISSING_AUTH_HEADER"
            }), 401
        
        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({
                "error": "Invalid Authorization header format",
                "code": "INVALID_AUTH_FORMAT"
            }), 401

        token = parts[1]

        try:
            public_key = get_public_key()
            
            decoded = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"]
            )

            request.token = token

        except ExpiredSignatureError:
            return jsonify({
                'error': 'Token expired',
                'code': 'TOKEN_EXPIRED'
            }), 401

        except InvalidTokenError as e:
            return jsonify({
                'error': 'Invalid token',
                'code': 'INVALID_TOKEN'
            }), 401

        return f(*args, **kwargs)

    return decorated_function
