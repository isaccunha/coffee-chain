from flask import Blueprint, request, jsonify
from middleware import require_json
from services.auth_service import AuthService
from validators import AuthLoginRequest, AuthRegisterRequest, validate_request_body, get_validation_error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
auth_service = AuthService()

@auth_bp.route('/login', methods=['POST'])
@require_json
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({
            'error': 'Request body is required',
            'code': 'EMPTY_BODY'
        }), 400
    
    is_valid, validated_data, errors = validate_request_body(data, AuthLoginRequest)
    
    if not is_valid:
        return jsonify(get_validation_error_response(errors)), 400
    
    success, token, error = auth_service.login(validated_data.email, validated_data.password)
    
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Login failed'),
            'code': 'LOGIN_FAILED'
        }), status_code
    
    return jsonify({
        'success': True,
        'token': token
    }), 200

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization', '')
    token = None

    if auth_header.startswith('Bearer '):
        token = auth_header.split('Bearer ')[1].strip()

    if not token:
        return jsonify({
            'error': 'Token is required (header Authorization or body)',
            'code': 'MISSING_TOKEN'
        }), 400

    if not isinstance(token, str) or not token.strip():
        return jsonify({
            'error': 'Token must be a non-empty string',
            'code': 'INVALID_TOKEN_FORMAT'
        }), 400

    success, user_data, error = auth_service.verify_token(token)

    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Token verification failed'),
            'code': 'VERIFICATION_FAILED'
        }), status_code

    return jsonify({
        'success': True,
        'user': user_data
    }), 200

@auth_bp.route('/register', methods=['POST'])
@require_json
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({
            'error': 'Request body is required',
            'code': 'EMPTY_BODY'
        }), 400
    
    is_valid, validated_data, errors = validate_request_body(data, AuthRegisterRequest)
    
    if not is_valid:
        return jsonify(get_validation_error_response(errors)), 400
    
    success, data, error = auth_service.register(validated_data.name, validated_data.email, validated_data.password)
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Registration failed'),
            'code': 'REGISTRATION_FAILED'
        }), status_code
    
    return jsonify({
        'success': True,
        'token': data["token"]
    }), 200
