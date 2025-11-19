from flask import request, jsonify
from functools import wraps
from services.auth_service import AuthService
from typing import Tuple, Dict, Any

auth_service = AuthService()

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

def require_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'error': 'Missing Authorization header',
                'code': 'MISSING_AUTH_HEADER'
            }), 401
        
        parts = auth_header.split()
        
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({
                'error': 'Invalid Authorization header format',
                'code': 'INVALID_AUTH_FORMAT'
            }), 401
        
        token = parts[1]
        success, user_data, error = auth_service.verify_token(token)
        
        if not success:
            return jsonify({
                'error': 'Unauthorized',
                'code': 'UNAUTHORIZED',
                'details': error
            }), 401
        
        request.user = user_data
        request.token = token
        
        return f(*args, **kwargs)
    
    return decorated_function
