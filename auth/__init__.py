from flask import Blueprint, jsonify
from auth.models import db, User, TokenBlocklist, ResetToken
from taskmanager.models import Task, Category, Subtask

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/inline-test', methods=['GET'])
def inline_test():
    return jsonify({"msg": "Inline test route is working!"})

from . import routes  # Import routes to register them
