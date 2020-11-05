from flask import Blueprint, jsonify, request
from app.models import User, Relationship, db
from flask_jwt_extended import jwt_required, create_access_token
from app.aws_s3 import upload_file_to_s3
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, not_
from datetime import datetime

user_routes = Blueprint('users', __name__, url_prefix='/api/users')

# Grab a single user for the profile page
@user_routes.route('/<int:id>', methods=['GET'])
@jwt_required
def find_user(id):
  user = User.query.get(id)
  data=user.to_dict()
  return jsonify(data=data)

# Update information for one user
@user_routes.route('/<int:id>', methods=['POST'])
@jwt_required
def update_user(id):
  # incoming = request.get_json()
  # print(incoming)
  user = User.query.get(id)
  
  cover_photo = request.files["file"]
  
  # user.first_name = incoming["firstName"]
  # user.last_name = incoming["lastName"]
  # user.bio = incoming["bio"]
  # user.city = incoming["city"]
  # user.state = incoming["state"]
  # user.country = incoming["country"]
  db.session.commit()

  token = create_access_token(identity=user.email)
  return jsonify(user=user.to_dict(), token=token)
# Grab all users and relationships for the search function
@user_routes.route('/<int:id>q=<string:value>', methods=['GET'])
@jwt_required
def find_users(id, value):
  users = User.query \
              .filter(or_(User.last_name.ilike('%'+value+'%'), \
                          User.first_name.ilike('%'+value+'%'))) \
              .filter(not_(User.id==id)) \
              .options(joinedload(User.relationships)) \
              .all()

  relationships = Relationship.query \
                              .filter(Relationship.user_id==id) \
                              .all()
  data=[user.to_dict() for user in users]
  friends=[relationship.to_dict() for relationship in relationships]
  
  return jsonify(data=data, friends=friends)

 
# Create a relationship
@user_routes.route('/<int:id>/add', methods=['POST'])
@jwt_required
def add_friend(id):
  incoming = request.get_json()
  print(incoming)
  date = datetime.now()
  relationship = Relationship(user_id=id,
                              friend_id=incoming,
                              status=1,
                              friends_since=date)
  db.session.add(relationship)
  db.session.commit()
  relationships= Relationship.query \
                              .filter(Relationship.user_id==id) \
                              .all()
  friends=[relationship.to_dict() for relationship in relationships]

  return jsonify(friends=friends)


