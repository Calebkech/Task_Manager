import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///task_manager.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')  # JWT secret key
