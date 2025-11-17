import json
import os

FILE_PATH = "data/state.json"


def load_state():
    # Carrega o estado salvo (chain, pending, config)
    if not os.path.exists(FILE_PATH):
        return None
    try:
        with open(FILE_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return None


def save_state(state):
    # Salva o estado completo no arquivo
    with open(FILE_PATH, "w") as f:
        json.dump(state, f, indent=4)
