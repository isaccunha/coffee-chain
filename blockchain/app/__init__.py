from flask import Flask
from .routes import bp

def create_app():
    # Inicializa a aplicação Flask
    app = Flask(__name__)

    # Registra as rotas
    app.register_blueprint(bp)

    return app
