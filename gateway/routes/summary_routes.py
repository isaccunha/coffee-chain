from flask import Blueprint, request, jsonify
from middleware import require_json, require_token
from services.summary_service import SummaryService
from validators import SummarizeRequest, validate_request_body, get_validation_error_response

summary_bp = Blueprint('summary', __name__, url_prefix='/summary')
summary_service = SummaryService()

# class SummarizeRequest(BaseModel):
#     farm_name: str = Field(..., min_length=1)
#     location: str = Field(..., min_length=1)
#     harvest_date: str = Field(..., min_length=1)
#     coffee_variety: str = Field(..., min_length=1)
#     altitude: str = Field(..., min_length=1)
#     coffee_bags: int = Field(..., gt=0)  
#     processing_method: str = Field(..., min_length=1)
#     certifications: list[dict[str, str]] = Field(...)
#     notes: str = Field(..., min_length=1)
@summary_bp.route('', methods=['POST'])
@require_json
@require_token
def summarize():
    data = request.get_json()
    
    if not data:
        return jsonify({
            'error': 'Request body is required',
            'code': 'EMPTY_BODY'
        }), 400
    
    is_valid, validated_data, errors = validate_request_body(data, SummarizeRequest)
    
    if not is_valid:
        return jsonify(get_validation_error_response(errors)), 400
    
    crop_data = validated_data.dict(exclude_none=True)

    success, result, error = summary_service.summarize_crop(crop_data, request.token)
    
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'error': error.get('message', 'Failed to summarize crop'),
            'code': 'SUMMARIZATION_FAILED'
        }), status_code
    
    return jsonify({
        'success': True,
        'data': result
    }), 200

@summary_bp.route('/health', methods=['GET'])
@require_token
def health():
    success, result, error = summary_service.health_check(request.token)
    
    if not success:
        status_code = error.get('status', 500)
        return jsonify({
            'status': 'unavailable',
            'error': error.get('message', 'Health check failed')
        }), status_code
    
    return jsonify({
        'success': True,
        'data': result
    }), 200
