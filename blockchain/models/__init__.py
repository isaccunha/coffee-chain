from flask import Flask
from .database import init_db

def create_app():
    # Inicializa a aplicação Flask
    app = Flask(__name__)

    # Inicializa as tabelas do banco de dados
    try:
        init_db()
    except Exception as e:
        print(f"Aviso: Não foi possível inicializar o banco de dados: {e}")
        print("A aplicação continuará funcionando sem persistência de logs.")

    return app

