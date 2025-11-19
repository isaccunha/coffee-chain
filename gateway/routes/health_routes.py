from flask import Blueprint, jsonify
from services.auth_service import AuthService
from services.blockchain_service import BlockchainService
from services.summary_service import SummaryService

health_bp = Blueprint('health', __name__, url_prefix='/health')

auth_service = AuthService()
blockchain_service = BlockchainService()
summary_service = SummaryService()

@health_bp.route('', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'service': 'gateway'
    }), 200

@health_bp.route('/dependencies', methods=['GET'])
def dependencies_health():
    status = {
        'gateway': 'ok',
        'auth': 'unknown',
        'blockchain': 'unknown',
        'summary': 'unknown'
    }
    
    auth_success, _, _ = auth_service.verify_token('test')
    status['auth'] = 'ok' if not auth_success or auth_success else 'unreachable'
    
    blockchain_success, _, _ = blockchain_service.validate_blockchain()
    status['blockchain'] = 'ok' if blockchain_success else 'unreachable'
    
    summary_success, _, _ = summary_service.health_check()
    status['summary'] = 'ok' if summary_success else 'unreachable'
    
    return jsonify(status), 200
