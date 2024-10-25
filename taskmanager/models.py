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

    # Relationships
    category = db.relationship('Category', backref='tasks', lazy=True)
    user = db.relationship('User', backref='tasks', lazy=True)
    subtasks = db.relationship(
        'Subtask',
        back_populates='task',
        lazy=True,
        cascade='all, delete-orphan'
    )

    @property
    def percentage_completion(self):
        """Calculate the percentage completion based on subtasks."""
        if not self.subtasks:
            return 0  # No subtasks, so 0% completion
        completed_subtasks = len([st for st in self.subtasks if st.completed])
        return int((completed_subtasks / len(self.subtasks)) * 100)

    def to_dict(self):
        """Convert the task instance to a dictionary for JSON responses."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed": self.completed,
            "category_id": self.category_id,
            "user_id": self.user_id,
            "percentage_completion": self.percentage_completion,
        }

class Subtask(db.Model):
    __tablename__ = 'subtasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Use back_populates instead of backref to avoid conflict
    task = db.relationship('Task', back_populates='subtasks', lazy=True)
