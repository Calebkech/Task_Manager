from flask import Blueprint
from auth.models import db

admin_bp = Blueprint('admin', __name__)

from . import routes