from pydantic import BaseModel, Field, validator, ValidationError
from typing import Optional, List, Dict, Any
from enum import Enum

class ErrorResponse(BaseModel):
    error: str
    code: str
    details: Optional[Dict[str, Any]] = None

class AuthLoginRequest(BaseModel):
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()

class SafraDataRequest(BaseModel):
    farm_name: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    harvest_date: str = Field(..., min_length=1)
    coffee_variety: str = Field(..., min_length=1)
    altitude: str = Field(..., min_length=1)
    coffee_bags: int = Field(..., gt=0)  
    processing_method: str = Field(..., min_length=1)
    certifications: list[dict[str, str]] = Field(...)
    notes: str = Field(..., min_length=1)

class SummarizeRequest(BaseModel):
    farm_name: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    harvest_date: str = Field(..., min_length=1)
    coffee_variety: str = Field(..., min_length=1)
    altitude: str = Field(..., min_length=1)
    coffee_bags: int = Field(..., ge=0)  
    processing_method: str = Field(..., min_length=1)
    certifications: list[dict[str, str]] = Field(...)
    notes: str = Field(...)

class SafraIdRequest(BaseModel):
    safra_id: str = Field(..., min_length=1)

def validate_request_body(data: Dict[str, Any], schema: BaseModel):
    try:
        validated = schema(**data)
        return True, validated, None
    except ValidationError as e:
        errors = {}
        for error in e.errors():
            field = '.'.join(str(x) for x in error['loc'])
            errors[field] = error['msg']
        return False, None, errors

def get_validation_error_response(errors: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'error': 'Validation failed',
        'code': 'VALIDATION_ERROR',
        'details': errors
    }
