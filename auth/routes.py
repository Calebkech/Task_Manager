print("Routes module loaded")  # Debugging log

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity, 
    get_jwt
)
from auth.models import User, db, TokenBlocklist
from auth.utils import roles_required
from auth import auth_bp

#auth_bp = Blueprint('auth', __name__)

# In-memory store for revoked tokens (for simplicity)
revoked_tokens = set()

@auth_bp.route('/register', methods=['POST'])
def register():

    print("Register endpoint hit")  # Debugging log

    data = request.get_json()

    print(f"Received data: {data}")  # Log received data

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if not username or not email or not password:
        return jsonify({"msg": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

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

    identity = {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Get the token's JTI
    # Save the revoked token to the database
    revoked_token = TokenBlocklist(jti=jti)
    db.session.add(revoked_token)
    db.session.commit()

    return jsonify({"msg": "Access token revoked"}), 200


@auth_bp.route('/admin/users', methods=['GET'])
@jwt_required()
@roles_required('admin')
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])


@auth_bp.route('/manager/tasks', methods=['GET'])
@jwt_required()
@roles_required('admin', 'manager')
def get_manager_tasks():
    return jsonify({"msg": "Welcome, Manager or Admin!"})


@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"msg": f"Welcome, {current_user['username']}!"}), 200
