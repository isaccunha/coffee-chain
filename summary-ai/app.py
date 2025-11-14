from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import requests
import json
import time

load_dotenv()

app = Flask(__name__)

OLLAMA_URL = os.getenv("OLLAMA_URL")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL")
REQUEST_TIMEOUT = 120
MAX_RETRIES = 2
RETRY_DELAY = 1


def is_ollama_available(retries: int = 1) -> bool:
    for attempt in range(retries):
        try:
            response = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            if attempt < retries - 1:
                time.sleep(RETRY_DELAY)
    return False


def summarize_crop_data(crop_data: dict) -> dict:
    farm_name = crop_data.get("farm_name", "N/A")
    location = crop_data.get("location", "N/A")
    harvest_date = crop_data.get("harvest_date", "N/A")
    quality_grade = crop_data.get("quality_grade", "N/A")
    weight = crop_data.get("weight", "0")
    processing_method = crop_data.get("processing_method", "N/A")
    coffe_variety = crop_data.get("coffe_variety", "N/A")
    altitude = crop_data.get("altitude", "N/A")
    certifications = crop_data.get("certifications", [])
    notes = crop_data.get("notes", "")
    
    certifications_str = ", ".join([f"{k}: {v}" for item in certifications for k, v in item.items()]) if certifications else "None"
    
    prompt = f"""Analise os seguintes dados de safra de café e forneça um resumo conciso e útil que será exibido no frontend:

Fazenda: {farm_name}
Localização: {location}
Data da Colheita: {harvest_date}
Grau de Qualidade: {quality_grade}
Peso: {weight}
Método de Processamento: {processing_method}
Variedade do Café: {coffe_variety}
Altitude: {altitude}
Certificações: {certifications_str}
Observações: {notes}

Forneça um resumo em português que inclua:
1. Avaliação geral da qualidade da safra
2. Principais características desta safra
3. Destaques do processamento e da variedade
4. Uma recomendação prática (insight acionável)

Mantenha o resumo conciso e adequado para exibição no frontend."""
    
    if not is_ollama_available():
        return {
            "success": False,
            "summary": f"{farm_name} ({quality_grade} grade) - {weight} from {location}, {processing_method} processed {coffe_variety}.",
            "fallback": True,
            "reason": "ollama_unavailable"
        }
    
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.5
                },
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            return {
                "success": True,
                "summary": response.json().get("response", "Unable to generate summary"),
                "fallback": False,
                "reason": "success"
            }
        except requests.exceptions.Timeout:
            if attempt == MAX_RETRIES - 1:
                return {
                    "success": False,
                    "summary": f"{farm_name} ({quality_grade} grade) - {weight} from {location}, {processing_method} processed {coffe_variety}.",
                    "fallback": True,
                    "reason": "timeout_after_retries"
                }
            time.sleep(RETRY_DELAY)
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "summary": f"{farm_name} ({quality_grade} grade) - {weight} from {location}, {processing_method} processed {coffe_variety}.",
                "fallback": True,
                "reason": type(e).__name__
            }


@app.route("/health", methods=["GET"])
def health():
    ollama_status = "available" if is_ollama_available(retries=1) else "unavailable"
    return jsonify({
        "status": "ok",
        "service": "coffee-api",
        "ollama": ollama_status,
        "ollama_url": OLLAMA_URL,
        "ollama_model": OLLAMA_MODEL
    }), 200


@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        crop_data = request.get_json()
        
        if not crop_data:
            return jsonify({
                "error": "Invalid JSON",
                "code": "INVALID_JSON"
            }), 400
        
        required_fields = ["farm_name", "harvest_date", "quality_grade"]
        missing_fields = [f for f in required_fields if f not in crop_data]
        
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "code": "MISSING_FIELDS",
                "missing": missing_fields
            }), 400
        
        result = summarize_crop_data(crop_data)
        
        return jsonify({
            "success": True,
            "data": {
                "farm_name": crop_data.get("farm_name"),
                "harvest_date": crop_data.get("harvest_date"),
                "quality_grade": crop_data.get("quality_grade"),
                "summary": result["summary"].strip()
            },
            "metadata": {
                "generated_by": "ollama" if not result.get("fallback") else "fallback",
                "model": OLLAMA_MODEL,
                "fallback_mode": result.get("fallback", False)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "code": "INTERNAL_ERROR",
            "details": type(e).__name__
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
