from flask import Blueprint, jsonify, request
from app.models import User
from flask_jwt_extended import jwt_required

user_routes = Blueprint('users', __name__, url_prefix='/api/users')

@user_routes.route('/')
def index():
  response = User.query.all()
  return { "users": [user.to_dict() for user in response]}