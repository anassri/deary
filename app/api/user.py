from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Notification, NotificationType, Comment, Like, db
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
  data_1 = [relationship.to_dict() for relationship in user.relationships]
  data_2 = [relationship.to_dict() for relationship in user.friendships]
  data={**user.to_dict(),
        "relationships":[*data_1, *data_2]
        }
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
              .all()

  relationships = Relationship.query \
                              .filter(or_(Relationship.user_id==id, 
                                          Relationship.friend_id==id)) \
                              .all()
  data=[user.to_dict() for user in users]
  friends=[relationship.to_dict() for relationship in relationships]
  
  return jsonify(data=data, friends=friends)

 
# Create a relationship
@user_routes.route('/<int:id>/add', methods=['POST'])
@jwt_required
def add_friend(id):
  incoming = request.get_json()
  relationship = Relationship(user_id=id,
                              friend_id=incoming["friendId"],
                              status=1,
                              friends_since=incoming["since"],
                              action_user_id=incoming["actionUserId"])
  db.session.add(relationship)
  db.session.commit()
  relationships= Relationship.query \
                              .filter(Relationship.user_id==id) \
                              .all()
  friends=[relationship.to_dict() for relationship in relationships]

  return jsonify(friends=friends)

# Update a relationship
@user_routes.route('/<int:id>/update', methods=['POST'])
@jwt_required
def update_friend(id):
  incoming = request.get_json()
    
  relationship = Relationship.query \
                              .filter(and_(Relationship.user_id==incoming["friendId"], \
                                      Relationship.friend_id==id)) \
                              .first()
  relationship.status = incoming["status"]
  relationship.friends_since = incoming["since"]
  relationship.action_user_id = incoming["actionUserId"]

  db.session.commit()

  return {'msg': 'relationship updated successfully'}

# Grab all posts belonging to the user
@user_routes.route('/<int:id>/profile', methods=['GET'])
@jwt_required
def find_all_posts(id):
    posts = Post.query \
                .filter(Post.user_id==id) \
                .all()
    
    data=[]
    for post in posts:
        comments = []
        likes = []
        tagged_people = []
        for comment in post.comments:
            comm = {**comment.to_dict(), "owner": comment.owner.to_dict()}
            comments.append(comm)
        for like in post.likes:
            lik = like.to_dict()
            likes.append(lik)
        for friend in post.tagged_friends:
            person = friend.users.to_dict()
            tagged_people.append(person)
        location = None
        photo = None
        if post.location:
            location = post.location.to_dict()
        if post.photos:
            photo = post.photos[0].to_dict()
        dic = {**post.to_dict(),
            "comments": comments,
            "type": post.type.to_dict(),
            "owner": post.owner.to_dict(),
            "likes": likes,
            "photo": photo,
            "location": location,
            "taggedFriends": tagged_people}
        data.append(dic)
        

    return jsonify(data=data)

  # Grab all notifications belonging to the user
@user_routes.route('/<int:id>/notifications', methods=['GET'])
@jwt_required
def find_all_notifications(id):
  notifications = Notification.query \
                              .filter(Notification.user_id==id) \
                              .options(joinedload(Notification.owner, User.relationships)) \
                              .filter(or_(Relationship.user_id==id, Relationship.friend_id==id)) \
                              .all()
  data = [{**notification.to_dict(),
          "friend": notification.friend.to_dict(),
          "relationship": notification.friend.relationships[0].to_dict() if len(notification.friend.relationships) else None,
          "type": notification.type.to_dict()} for notification in notifications]

  return jsonify(data=data)


# Update notification status
@user_routes.route('/<int:id>/notifications', methods=['POST'])
@jwt_required
def update_notifications(id):
  incoming = request.get_json()
  notification_id = incoming["notificationId"]
  notification = Notification.query.get(notification_id)

  notification.status = incoming["status"]
  db.session.commit()

  return {'msg': 'notification updated successfully'}

# Create notification 
@user_routes.route('/<int:id>/notifications/create', methods=['POST'])
@jwt_required
def create_notifications(id):
  incoming = request.get_json()
  if "postId" not in incoming:
    postId = None
  else: 
    postId = incoming["postId"]
  notification = Notification(post_id=postId,
                              user_id=incoming["friendId"],
                              friend_id=id,
                              type_id=incoming["typeId"],
                              created_at=incoming["createdAt"],
                              status=1)

  db.session.add(notification)
  db.session.commit()

  return {'msg': 'notification created successfully'}


  # get one post
@user_routes.route('/post/<int:id>', methods=['GET'])
@jwt_required
def get_one_post(id):
  post = Post.query \
             .get(id)
  
  comments = []
  likes = []
  tagged_people = []
  for comment in post.comments:
      comm = {**comment.to_dict(), "owner": comment.owner.to_dict()}
      comments.append(comm)
  for like in post.likes:
      lik = like.to_dict()
      likes.append(lik)
  for friend in post.tagged_friends:
      person = friend.users.to_dict()
      tagged_people.append(person)
  location = None
  photo = None
  if post.location:
      location = post.location.to_dict()
  if post.photos:
      photo = post.photos[0].to_dict()
  data = {**post.to_dict(),
      "comments": comments,
      "type": post.type.to_dict(),
      "owner": post.owner.to_dict(),
      "likes": likes,
      "photo": photo,
      "location": location,
      "taggedFriends": tagged_people}
  print(data)
  return jsonify(data=data) 