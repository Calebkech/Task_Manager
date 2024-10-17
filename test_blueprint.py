from flask import Blueprint, jsonify

test_bp = Blueprint('test_bp', __name__)

@test_bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"msg": "Hello from the test blueprint!"})
