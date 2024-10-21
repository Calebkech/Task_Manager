# taskmanager/models.py
from auth.models import db 
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(10), nullable=False, default='Medium')
    due_date = db.Column(db.DateTime, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Use string-based references for relationships
    category = db.relationship('Category', backref='tasks', lazy=True)
    user = db.relationship('User', backref='tasks', lazy=True)  # String reference to avoid circular import

class Subtask(db.Model):
    __tablename__ = 'subtasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    task = db.relationship('Task', backref='subtasks', lazy=True)
