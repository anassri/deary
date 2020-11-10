from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, Like, db
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
  user = User.query.get(id)
  incoming = request.get_json()

  user.first_name = incoming["firstName"]
  user.last_name = incoming["lastName"]
  user.bio = incoming["bio"]
  user.city = incoming["city"]
  user.state = incoming["state"]
  user.country = incoming["country"]

  db.session.commit()

  return user.to_dict()

# Update cover photo for one user
@user_routes.route('/<int:id>/cover', methods=['POST'])
@jwt_required
def update_cover_photo(id):
  user = User.query.get(id)
  if "coverPicture" not in request.files:
        return "No file key in request.files"
  cover_photo = request.files['coverPicture']
  if cover_photo:
    cover_photo_link = upload_file_to_s3(cover_photo)
    user.cover_picture = cover_photo_link
  else:
    return "No file key in request.files"
  db.session.commit()

  return user.to_dict()

# Update profile photo for one user
@user_routes.route('/<int:id>/photo', methods=['POST'])
@jwt_required
def update_profile_photo(id):
  user = User.query.get(id)
  if "profilePicture" not in request.files:
        return "No file key in request.files"
  profile_photo = request.files['profilePicture']
  if profile_photo:
    profile_photo_link = upload_file_to_s3(profile_photo)
    user.profile_picture = profile_photo_link
  else:
    return "No file key in request.files"
  db.session.commit()

  return user.to_dict()


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

# Grab all posts belonging to the user
@user_routes.route('/<int:id>/profile', methods=['GET'])
@jwt_required
def find_all_posts(id):
    posts = Post.query \
                .filter(Post.user_id==id) \
                .options(joinedload(Post.comments) \
                          .joinedload(Comment.owner)) \
                .options(joinedload(Post.type)) \
                .options(joinedload(Post.likes)) \
                .all()
    
    data=[]
    for post in posts:
        comments = []
        likes = []
        for comment in post.comments:
            comm = {**comment.to_dict(), "owner": comment.owner.to_dict()}
            comments.append(comm)
        for like in post.likes:
            lik = like.to_dict()
            likes.append(lik)
        dic = {**post.to_dict(),
            "comments": comments,
            "type": post.type.to_dict(),
            "owner": post.owner.to_dict(),
            "likes": likes}
        data.append(dic)
        

    return jsonify(data=data)