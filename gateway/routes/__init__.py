from .health_routes import health_bp
from .auth_routes import auth_bp
from .safra_routes import safra_bp
from .summary_routes import summary_bp

def register_routes(app):
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(safra_bp)
    app.register_blueprint(summary_bp)
