from flask import Flask, Blueprint, jsonify

app = Flask(__name__)
bp = Blueprint('test', __name__)

@bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"msg": "Hello, World!"})

app.register_blueprint(bp, url_prefix='/test')

if __name__ == '__main__':
    app.run(debug=True)
