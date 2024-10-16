from flask import Blueprint, request, jsonify
from models import User, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate incoming data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')  # Default role is 'user'

    if not username or not email or not password:
        return jsonify({"msg": "Username, email, and password are required"}), 400

    # Check if the username or email already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    # Create new user
    new_user = User(username=username, email=email, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity={
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    })
    return jsonify({"access_token": access_token}), 200

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Example of a protected route."""
    current_user = get_jwt_identity()
    return jsonify({"msg": f"Welcome {current_user['username']}!"}), 200
