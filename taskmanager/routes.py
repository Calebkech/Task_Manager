from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, Task, Category, Subtask
from datetime import datetime

task_bp = Blueprint('tasks', __name__, url_prefix='/tasks')

from flask import make_response

@task_bp.route('', methods=['OPTIONS'])
def handle_options():
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    return response

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
        due_date = data.get('due_date')  # Use the correct field name from the frontend

        if not title:
            return jsonify({"msg": "Task title is required"}), 400

        # Parse the due_date if provided
        parsed_due_date = None
        if due_date:
            parsed_due_date = datetime.strptime(due_date, '%Y-%m-%d')

        task = Task(
            title=title,
            description=description,
            priority=priority,
            due_date=parsed_due_date,
            user_id=current_user['user_id'],
            created_at=datetime.utcnow()
        )

        print(f"Received data: {data}")  # Log received data
        print(f"Parsed due_date: {parsed_due_date}")  # Log parsed due date

        db.session.add(task)
        db.session.commit()

        return jsonify({"msg": "Task created successfully", "task": task.title}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating task: {str(e)}"}), 500

# Get all tasks for the logged-in user
@task_bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    try:
        current_user = get_jwt_identity()

        # Retrieve tasks ordered by due date (most recent due date first)
        tasks = (
            Task.query
            .filter_by(user_id=current_user['user_id'])
            .order_by(Task.due_date.desc().nullslast(), Task.id.desc())  # Order by due date first, then ID
            .all()
        )

        # Convert each task into a dictionary
        task_list = [
            task.to_dict()  # Use the to_dict() method from the model for consistency
            for task in tasks
        ]

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

        # Handle due date update
        due_date = data.get('due_date')
        if due_date:
            try:
                task.due_date = datetime.strptime(due_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Commit the changes to the database
        print(f"Received update data: {data}")  # Log received data
        print(f"Parsed due_date: {due_date}")  # Log parsed due date

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

# -------------------- SUBTASK ROUTES --------------------

# Create a new subtask for a specific task
@task_bp.route('/<int:task_id>/subtasks', methods=['POST'])
@jwt_required()
def create_subtask(task_id):
    try:
        current_user = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=current_user['user_id']).first()

        if not task:
            return jsonify({"msg": "Task not found"}), 404

        data = request.get_json()
        title = data.get('title')

        if not title:
            return jsonify({"msg": "Subtask title is required"}), 400

        subtask = Subtask(title=title, task_id=task_id, created_at=datetime.utcnow())
        db.session.add(subtask)
        db.session.commit()

        return jsonify({"msg": "Subtask created successfully", "subtask": subtask.title}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating subtask: {str(e)}"}), 500

# Get all subtasks for a specific task
@task_bp.route('/<int:task_id>/subtasks', methods=['GET'])
@jwt_required()
def get_subtasks(task_id):
    try:
        current_user = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=current_user['user_id']).first()

        if not task:
            return jsonify({"msg": "Task not found"}), 404

        subtasks = Subtask.query.filter_by(task_id=task_id).all()
        subtask_list = [{"id": st.id, "title": st.title, "completed": st.completed} for st in subtasks]

        return jsonify(subtask_list), 200

    except Exception as e:
        return jsonify({"msg": f"Error fetching subtasks: {str(e)}"}), 500

# Update a subtask by task_id and subtask_id
@task_bp.route('/<int:task_id>/subtasks/<int:subtask_id>', methods=['PUT'])
@jwt_required()
def update_subtask(task_id, subtask_id):
    try:
        # Retrieve the subtask from the database
        subtask = Subtask.query.filter_by(id=subtask_id, task_id=task_id).first()
        
        if not subtask:
            return jsonify({"msg": "Subtask not found"}), 404

        data = request.get_json()

        # Convert completed field to boolean
        completed = data.get('completed', False)  # Defaults to False if not provided
        if isinstance(completed, str):  # Check if it's a string
            completed = completed.lower() == 'true'  # Convert 'true'/'false' to boolean

        subtask.title = data.get('title', subtask.title)
        subtask.completed = completed  # Update with boolean value

        db.session.commit()
        return jsonify({"msg": "Subtask updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error updating subtask: {str(e)}"}), 500
    
# Delete a subtask by ID
@task_bp.route('/<int:task_id>/subtasks/<int:subtask_id>', methods=['DELETE'])
@jwt_required()
def delete_subtask(task_id, subtask_id):
    try:
        current_user = get_jwt_identity()
        subtask = Subtask.query.filter_by(id=subtask_id, task_id=task_id).first()

        if not subtask:
            return jsonify({"msg": "Subtask not found"}), 404

        db.session.delete(subtask)
        db.session.commit()
        return jsonify({"msg": "Subtask deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting subtask: {str(e)}"}), 500
