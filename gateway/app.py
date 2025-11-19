from flask import Flask
from flask_cors import CORS
from routes import register_routes
from config import Config

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    register_routes(app)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(
        host=app.config['API_GATEWAY_HOST'],
        port=app.config['API_GATEWAY_PORT'],
        debug=app.config['DEBUG']
    )
