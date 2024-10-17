from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from auth.models import db, TokenBlocklist  # Import your models
from auth.routes import auth_bp  # Import the auth blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')  # Register the auth blueprint

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        """Check if the token's JTI is in the blocklist."""
        jti = jwt_payload["jti"]
        token = TokenBlocklist.query.filter_by(jti=jti).first()
        return token is not None

    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({"msg": "Missing or invalid token"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"msg": "Invalid token"}), 422

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
