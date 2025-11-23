import uuid

from validators import SafraDataRequest, get_validation_error_response, validate_request_body
from flask import Blueprint, request, jsonify
from models.storage import load_state, save_state
from models.blockchain import Blockchain
from services.blockchain_service import HarvestLogService
from models.database import init_db
from middleware import require_role, require_json, require_token
from datetime import datetime, timezone, timedelta

bp = Blueprint("routes", __name__)

BRASILIA_TZ = timezone(timedelta(hours=-3))

loaded_state = load_state()
blockchain = Blockchain(loaded_state=loaded_state)


def persist():
    save_state(blockchain.export_state())


# POST /safra — adiciona nova safra
@bp.route("/safra", methods=["POST"])
@require_json
@require_token
@require_role("INSPECTOR")
def add_safra():
    user_email = request.user_email
    data = request.get_json()

    is_valid, validated_data, errors = validate_request_body(data, SafraDataRequest)
    
    if not is_valid:
        return jsonify(get_validation_error_response(errors)), 400
    
    payload = validated_data.dict(exclude_none=True)

    payload.update({
        "id": f"safra-{uuid.uuid4()}",        
        "inserted_at": datetime.utcnow().isoformat(),  
        "owner": user_email            
    })
    
    added = blockchain.add_data(payload)
    HarvestLogService.log_harvest_creation(added["id"], user_email, payload)

    # Se já atingir min_batch_size, minera automaticamente
    mined_block = None
    if len(blockchain.pending_data) >= blockchain.min_batch_size:
        mined_block = blockchain.mine_block()
        
        # Se minerou, atualiza status para "verified"
        if mined_block:
            for data in mined_block["data"]:
                HarvestLogService.update_harvest_status(data["id"], "verified")

    persist()

    if mined_block is None:
        return jsonify({
            "message": "Safra registrada e aguardando mineracao",
            "pending": len(blockchain.pending_data),
            "min_batch_size": blockchain.min_batch_size,
            "id": added["id"]
        }), 201

    return jsonify({
        "message": "Safra registrada e bloco minerado automaticamente",
        "id": added["id"],
        "block_index": mined_block["index"]
    }), 201


# GET /safra/<id> — retorna a versão mais recente da safra
@bp.route("/safra/<safra_id>", methods=["GET"])
@require_token
@require_role("INSPECTOR", "BUYER")
def get_safra(safra_id):
    todas = []

    # Coleta versões pendentes
    for d in blockchain.pending_data:
        if d["id"] == safra_id:
            todas.append({"origin": "pending", "data": d})

    # Coleta versões mineradas
    for block in blockchain.chain:
        for d in block["data"]:
            if d["id"] == safra_id:
                todas.append({
                    "origin": "mined",
                    "block_index": block["index"],
                    "data": d
                })

    if not todas:
        return jsonify({"found": False, "error": "Safra nao encontrada"}), 404

    # Seleciona a versão mais recente pelo timestamp
    mais_recente = max(todas, key=lambda x: x["data"]["inserted_at"])
    
    # Log de acesso à safra
    HarvestLogService.log_harvest_access(safra_id, request.user_email, harvest_data=mais_recente["data"])

    return jsonify({
        "found": True,
        **mais_recente
    }), 200


# GET /valid — verifica integridade da blockchain
@bp.route("/valid", methods=["GET"])
@require_token
@require_role("INSPECTOR")
def is_valid():
    valid = blockchain.chain_valid(blockchain.chain)
    return jsonify({"valid": valid}), 200


# GET /safra/<id>/historico — retorna todas versões da safra
@bp.route("/safra/<safra_id>/historico", methods=["GET"])
@require_token
@require_role("INSPECTOR", "BUYER")
def safra_historico(safra_id):
    historico = []

    # Versões pendentes
    for d in blockchain.pending_data:
        if d["id"] == safra_id:
            historico.append({"origin": "pending", "data": d})

    # Versões mineradas
    for block in blockchain.chain:
        for d in block["data"]:
            if d["id"] == safra_id:
                historico.append({
                    "origin": "mined",
                    "block_index": block["index"],
                    "timestamp": block["timestamp"],
                    "data": d
                })

    if not historico:
        return jsonify({"found": False, "error": "Safra nao encontrada"}), 404

    # Seleciona a versão mais recente pelo timestamp
    mais_recente = max(historico, key=lambda h: h["data"]["inserted_at"])
    
    # Log de acesso à safra
    HarvestLogService.log_harvest_access(safra_id, request.user_email, harvest_data=mais_recente["data"])

    return jsonify({
        "found": True,
        "id": safra_id,
        "history": historico
    }), 200


# GET /logs/creation — últimos N logs de criação, opcionalmente de um usuário
@bp.route("/logs/creation", methods=["GET"])
@require_token
@require_role("INSPECTOR", "BUYER")
def get_creation_logs():
    limit = request.args.get("limit", default=10, type=int)
    email = request.args.get("email", default=None, type=str)

    # Validar limit
    if limit < 1 or limit > 100:
        limit = 10

    if email:
        logs = HarvestLogService.get_creation_logs_by_email(email=email, limit=limit)
    else:
        logs = HarvestLogService.get_creation_logs(limit=limit)  

    return jsonify({
        "email": email,
        "total": len(logs),
        "limit": limit,
        "logs": [
            {
                "id": log.id,
                "harvest_id": log.harvest_id,
                "owner_email": log.owner_email,
                "status": log.status,
                "farm_name": log.farm_name,
                "location": log.location,
                "harvest_date": log.harvest_date,
                "coffee_variety": log.coffee_variety,
                "altitude": log.altitude,
                "coffee_bags": log.coffee_bags,
                "processing_method": log.processing_method,
                "notes": log.notes,
                "created_at": log.created_at.isoformat() if log.created_at else None,
                "verified_at": log.verified_at.isoformat() if log.verified_at else None
            }
            for log in logs
        ]
    }), 200


# GET /logs/access — últimos N logs de acesso, opcionalmente de um usuário
@bp.route("/logs/access", methods=["GET"])
@require_token
@require_role("INSPECTOR", "BUYER")
def get_access_logs():
    limit = request.args.get("limit", default=10, type=int)
    email = request.args.get("email", default=None, type=str)

    # Validar limit
    if limit < 1 or limit > 100:
        limit = 10

    if email:
        logs = HarvestLogService.get_access_logs_by_email(email=email, limit=limit)
    else:
        logs = HarvestLogService.get_access_logs(limit=limit) 

    return jsonify({
        "email": email,
        "total": len(logs),
        "limit": limit,
        "logs": [
            {
                "id": log.id,
                "harvest_id": log.harvest_id,
                "accessor_email": log.accessor_email,
                "farm_name": log.farm_name,
                "location": log.location,
                "harvest_date": log.harvest_date,
                "coffee_variety": log.coffee_variety,
                "altitude": log.altitude,
                "coffee_bags": log.coffee_bags,
                "processing_method": log.processing_method,
                "notes": log.notes,
                "accessed_at": log.accessed_at.isoformat() if log.accessed_at else None
            }
            for log in logs
        ]
    }), 200

@bp.route("/user/stats", methods=["GET"])
@require_token
@require_role("INSPECTOR", "BUYER")
def get_dashboard_stats():
    user_email = request.user_email
    user_role = request.user_role  

    db = HarvestLogService

    if user_role == "INSPECTOR":
        total_inspections = len(db.get_creation_logs_by_email(user_email))
        pending_inspections = len([
            log for log in db.get_creation_logs_by_email(user_email) 
            if log.status != "verified"
        ])
        return jsonify({
            "role": "INSPECTOR",
            "total_inspections": total_inspections,
            "pending_inspections": pending_inspections
        }), 200

    elif user_role == "BUYER":
        total_accesses = len(db.get_access_logs_by_email(user_email))
        today = datetime.now(BRASILIA_TZ).date()
        accesses_today = len([
            log for log in db.get_access_logs_by_email(user_email)
            if log.accessed_at.date() == today
        ])
        return jsonify({
            "role": "BUYER",
            "total_accesses": total_accesses,
            "accesses_today": accesses_today
        }), 200

    return jsonify({"error": "Role inválido"}), 403