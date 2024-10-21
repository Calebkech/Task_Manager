from flask import Blueprint
from auth.models import db, User, TokenBlocklist, ResetToken
from taskmanager.models import Task, Category, Subtask


task_bp = Blueprint('taskmanager', __name__)

from . import routes  # Import routes to register them with the blueprint
