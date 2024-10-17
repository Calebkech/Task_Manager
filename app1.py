from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from auth import auth_bp  # Import the auth blueprint
from auth.models import db
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
print("Auth blueprint registered")  # Debugging log

if __name__ == '__main__':
    app.run(debug=True)
