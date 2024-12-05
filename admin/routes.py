print("Routes module loaded")  # Debugging log

from flask import Blueprint, request, jsonify, url_for
from .model import Settings, db

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/new_setting', methods=['POST'])
def new_settings():
    try:
        data = request.get_json()

        # Extract all fields from the request data
        reset_url = data.get('reset_url')
        email_body = data.get('email_body')
        password = data.get('password')
        mail_server = data.get('mail_server')
        mail_port = data.get('mail_port')
        mail_use_tls = data.get('mail_use_tls', True)  # Default to True
        mail_username = data.get('mail_username')

        # Validate required fields
        if not reset_url:
            return jsonify({"msg": "Reset URL is required"}), 400
        if not email_body:
            return jsonify({"msg": "Email Body is required"}), 400
        if not password:
            return jsonify({"msg": "Password is required"}), 400

        # Create new Settings instance
        new_conf = Settings(
            reset_url=reset_url,
            email_body=email_body,
            mail_server=mail_server,
            mail_port=mail_port,
            mail_use_tls=mail_use_tls,
            mail_username=mail_username
        )
        new_conf.password = password  # Hash the password using the model's setter

        db.session.add(new_conf)
        db.session.commit()

        return jsonify({"msg": "Settings saved successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error saving: {str(e)}"}), 500

@admin_bp.route('', methods=['GET'])
def get_settings():
    try:
        # Fetch all settings and serialize them
        current_settings = Settings.query.order_by(Settings.id).all()
        settings_list = [current_setting.to_dict() for current_setting in current_settings]

        return jsonify(settings_list), 200

    except Exception as e:
        return jsonify({"msg": f"Error fetching settings: {str(e)}"}), 500

@admin_bp.route('/update/<int:config_id>', methods=['PUT'])
def update_conf(config_id):
    try:
        conf = Settings.query.get(config_id)
        if not conf:
            return jsonify({"msg": "Configuration not found"}), 404

        data = request.get_json()

        # Update all fields with the new values if provided
        conf.reset_url = data.get('reset_url', conf.reset_url)
        conf.email_body = data.get('email_body', conf.email_body)
        conf.mail_server = data.get('mail_server', conf.mail_server)
        conf.mail_port = data.get('mail_port', conf.mail_port)
        conf.mail_use_tls = data.get('mail_use_tls', conf.mail_use_tls)
        conf.mail_username = data.get('mail_username', conf.mail_username)
        
        # Update password if provided
        if 'password' in data:
            conf.password = data['password']

        db.session.commit()
        return jsonify({"msg": "Configuration updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error updating configuration: {str(e)}"}), 500

@admin_bp.route('/delete/<int:conf_id>', methods=['DELETE'])
def delete_conf(conf_id):
    try:
        conf = Settings.query.get(conf_id)
        if not conf:
            return jsonify({"msg": "Configuration not found"}), 404

        db.session.delete(conf)
        db.session.commit()

        return jsonify({"msg": "Configuration successfully deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error deleting configuration: {str(e)}"}), 500
