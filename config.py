class Config:
    SECRET_KEY = "supersecretkey"  # Replace with an env variable in production
    SQLALCHEMY_DATABASE_URI = "sqlite:///task_manager.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "jwt-secret-key"  # JWT secret for token encoding
