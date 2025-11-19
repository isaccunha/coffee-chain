import uuid

from datetime import datetime
from flask import Blueprint, request, jsonify
from middleware import require_json, require_token
from services.blockchain_service import BlockchainService
from validators import SafraDataRequest, validate_request_body, get_validation_error_response

safra_bp = Blueprint('safra', __name__, url_prefix='/safra')
blockchain_service = BlockchainService()

@safra_bp.route('', methods=['POST'])
@require_json
@require_token
def create_safra():
    data = request.get_json()
    
    if not data:
        return jsonify({
            'error': 'Request body is required',
            'code': 'EMPTY_BODY'
        }), 400
    
    is_valid, validated_data, errors = validate_request_body(data, SafraDataRequest)
    
    if not is_valid:
        return jsonify(get_validation_error_response(errors)), 400
    
    safra_payload = validated_data.dict(exclude_none=True)
    user_identifier = request.user.get('email') or request.user.get('sub', 'unknown')

    # {
    #    "id": "safra-teste-1",
    #    "inserted_at": "2025-11-17 02:37:31.042947",
    #    "owner": "isac"
    # }
    safra_payload.update({
        "id": f"safra-{uuid.uuid4()}",        
        "inserted_at": datetime.utcnow().isoformat(),  
        "owner": user_identifier            
    })

    success, result, error = blockchain_service.add_safra(safra_payload, user_identifier)
    
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Failed to create safra'),
            'code': 'SAFRA_CREATION_FAILED'
        }), status_code
    
    return jsonify({
        'success': True,
        'data': result
    }), 201

@safra_bp.route('/<safra_id>', methods=['GET'])
@require_token
def get_safra(safra_id):
    if not safra_id or not isinstance(safra_id, str) or not safra_id.strip():
        return jsonify({
            'error': 'Invalid safra ID',
            'code': 'INVALID_SAFRA_ID'
        }), 400
    
    success, result, error = blockchain_service.get_safra(safra_id)
    
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Safra not found'),
            'code': 'SAFRA_NOT_FOUND'
        }), status_code
    
    return jsonify({
        'success': True,
        'data': result
    }), 200

@safra_bp.route('/<safra_id>/history', methods=['GET'])
@require_token
def get_safra_history(safra_id):
    if not safra_id or not isinstance(safra_id, str) or not safra_id.strip():
        return jsonify({
            'error': 'Invalid safra ID',
            'code': 'INVALID_SAFRA_ID'
        }), 400
    
    success, result, error = blockchain_service.get_safra_history(safra_id)
    
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Safra not found'),
            'code': 'SAFRA_NOT_FOUND'
        }), status_code
    
    return jsonify({
        'success': True,
        'data': result
    }), 200

@safra_bp.route('/validate', methods=['GET'])
@require_token
def validate_blockchain():
    success, result, error = blockchain_service.validate_blockchain()
    
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Validation failed'),
            'code': 'VALIDATION_FAILED'
        }), status_code
    
    return jsonify({
        'success': True,
        'data': result
    }), 200
