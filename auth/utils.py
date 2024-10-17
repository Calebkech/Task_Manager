from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify

def roles_required(*roles):
    """Decorator to restrict access based on user roles."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()  # Get the current user's identity
            print(f"Current User: {current_user}")  # Debugging log

            # Check if the user's role matches any of the allowed roles
            if current_user['role'] not in roles:
                print(f"Access denied for role: {current_user['role']}")  # Debugging log
                return jsonify({"msg": "Access denied!"}), 403

            print(f"Access granted for role: {current_user['role']}")  # Debugging log
            return fn(*args, **kwargs)
        return wrapper
    return decorator
