from flask import Blueprint, jsonify, request, redirect
from app.models import User
from flask_jwt_extended import JWTManager, jwt_required, get_raw_jwt, create_access_token

auth_routes = Blueprint('auth', __name__, url_prefix='/')

@auth_routes.route('/login', methods=['POST'])
def login():
    incoming = request.get_json()
    user = User.query.filter_by(email=incoming['email']).one()
    if user and user.check_password(incoming['password']):
        token = create_access_token(identity=user.email)
        return jsonify(user=user.to_dict(), token=token)
    else:
        return {"message": "Incorrect email or password"}, 400