from flask import Blueprint, request, jsonify
from .storage import load_state, save_state
from .blockchain import Blockchain

bp = Blueprint("routes", __name__)

# ---------------------------------------------------------
# Inicializar blockchain com persistência
# ---------------------------------------------------------
loaded_state = load_state()
blockchain = Blockchain(loaded_state=loaded_state)

# Salva estado atual no disco
def persist():
    save_state(blockchain.export_state())

# ---------------------------------------------------------
# POST /safra — adiciona nova safra
# ---------------------------------------------------------
@bp.route("/safra", methods=["POST"])
def add_safra():
    payload = request.json
    user = request.headers.get("X-User")

    if not payload:
        return jsonify({"error": "JSON ausente"}), 400
    if not user:
        return jsonify({"error": "Header X-User obrigatorio"}), 400

    payload["owner"] = user
    added = blockchain.add_data(payload)

    # Se já atingir min_batch_size, minera automaticamente
    mined_block = None
    if len(blockchain.pending_data) >= blockchain.min_batch_size:
        mined_block = blockchain.mine_block()

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

# ---------------------------------------------------------
# GET /safra/<id> — retorna a versão mais recente da safra
# ---------------------------------------------------------
@bp.route("/safra/<safra_id>", methods=["GET"])
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

    return jsonify({
        "found": True,
        **mais_recente
    }), 200

# ---------------------------------------------------------
# GET /valid — verifica integridade da blockchain
# ---------------------------------------------------------
@bp.route("/valid", methods=["GET"])
def is_valid():
    valid = blockchain.chain_valid(blockchain.chain)
    return jsonify({"valid": valid}), 200

# ---------------------------------------------------------
# GET /safra/<id>/historico — retorna todas versões da safra
# ---------------------------------------------------------
@bp.route("/safra/<safra_id>/historico", methods=["GET"])
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

    # Ordena histórico por timestamp
    historico.sort(key=lambda h: h["data"]["inserted_at"])

    return jsonify({
        "found": True,
        "id": safra_id,
        "history": historico
    }), 200
