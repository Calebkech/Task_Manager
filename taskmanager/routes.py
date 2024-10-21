from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, Task, Category
from datetime import datetime

task_bp = Blueprint('tasks', __name__, url_prefix='/tasks')

# Create a task
@task_bp.route('/new-task', methods=['POST'])
@jwt_required()
def create_task():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        title = data.get('title')
        description = data.get('description', '')
        priority = data.get('priority', 'Medium')
        due_date = data.get('due_date')

        if not title:
            return jsonify({"msg": "Task title is required"}), 400

        task = Task(
            title=title,
            description=description,
            priority=priority,
            due_date=datetime.strptime(due_date, '%Y-%m-%d') if due_date else None,
            user_id=current_user['user_id'],
            created_at=datetime.utcnow()
        )

        db.session.add(task)
        db.session.commit()
        return jsonify({"msg": "Task created successfully", "task": task.title}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating task: {str(e)}"}), 500

# Get all tasks for the logged-in user
@task_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        current_user = get_jwt_identity()
        tasks = Task.query.filter_by(user_id=current_user['user_id']).all()

        task_list = [{
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "due_date": task.due_date.strftime('%Y-%m-%d') if task.due_date else None,
            "completed": task.completed
        } for task in tasks]

        return jsonify(task_list), 200

    except Exception as e:
        return jsonify({"msg": f"Error fetching tasks: {str(e)}"}), 500

# Get individual task by ID
@task_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    try:
        current_user = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=current_user['user_id']).first()

        if not task:
            return jsonify({"msg": "Task not found"}), 404

        task_data = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "due_date": task.due_date.strftime('%Y-%m-%d') if task.due_date else None,
            "completed": task.completed
        }

        return jsonify(task_data), 200

    except Exception as e:
        return jsonify({"msg": f"Error fetching task: {str(e)}"}), 500

# Update a task by ID
@task_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    try:
        current_user = get_jwt_identity()
        user_id = current_user['user_id']
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()

        if not task:
            return jsonify({"msg": "Task not found"}), 404

        data = request.get_json()
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.priority = data.get('priority', task.priority)
        task.completed = data.get('completed', task.completed)

        db.session.commit()
        return jsonify({"msg": "Task updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error updating task: {str(e)}"}), 500

# Delete a task by ID
@task_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    try:
        current_user = get_jwt_identity()
        user_id = current_user['user_id']
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()

        if not task:
            return jsonify({"msg": "Task not found"}), 404

        db.session.delete(task)
        db.session.commit()
        return jsonify({"msg": "Task deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting task: {str(e)}"}), 500

# CRUD for Categories
# Create a new category
@task_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    try:
        data = request.get_json()
        name = data.get('name')

        if not name:
            return jsonify({"msg": "Category name is required"}), 400

        category = Category(name=name)
        db.session.add(category)
        db.session.commit()
        return jsonify({"msg": "Category created successfully", "category": category.name}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating category: {str(e)}"}), 500

# Get all categories
@task_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    try:
        categories = Category.query.all()
        category_list = [{"id": cat.id, "name": cat.name} for cat in categories]
        return jsonify(category_list), 200

    except Exception as e:
        return jsonify({"msg": f"Error fetching categories: {str(e)}"}), 500

# Update a category by ID
@task_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"msg": "Category not found"}), 404

        data = request.get_json()
        category.name = data.get('name', category.name)

        db.session.commit()
        return jsonify({"msg": "Category updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error updating category: {str(e)}"}), 500

# Get individual category by ID
@task_bp.route('/categories/<int:category_id>', methods=['GET'])
@jwt_required()
def get_category(category_id):
    try:
        category = Category.query.get(category_id)

        if not category:
            return jsonify({"msg": "Category not found"}), 404

        category_data = {"id": category.id, "name": category.name}
        return jsonify(category_data), 200

    except Exception as e:
        return jsonify({"msg": f"Error fetching category: {str(e)}"}), 500

# Delete a category by ID
@task_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"msg": "Category not found"}), 404

        db.session.delete(category)
        db.session.commit()
        return jsonify({"msg": "Category deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting category: {str(e)}"}), 500
