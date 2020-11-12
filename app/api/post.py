from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, TaggedFriend, Photo, Location, db
from flask_jwt_extended import jwt_required, create_access_token
from app.aws_s3 import upload_file_to_s3
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, not_
from datetime import datetime
from app.config import Config
import requests


post_routes = Blueprint('posts', __name__, url_prefix='/api/posts')

token = Config.GEOCODING_TOKEN

@post_routes.route('/<int:id>', methods=['GET'])
@jwt_required
def find_all_posts(id):
    relationships = Relationship.query \
                        .filter(and_(Relationship.user_id==id, Relationship.status==2)) \
                        .options(joinedload(Relationship.friends) \
                                .joinedload(User.posts) \
                                .joinedload(Post.comments) \
                                .joinedload(Comment.owner)) \
                        .options(joinedload(Relationship.friends) \
                                .joinedload(User.posts) \
                                .joinedload(Post.type)) \
                        .options(joinedload(Relationship.friends) \
                                .joinedload(User.posts) \
                                .joinedload(Post.owner)) \
                        .options(joinedload(Relationship.friends) \
                                .joinedload(User.posts) \
                                .joinedload(Post.likes)) \
                        .options(joinedload(Relationship.friends) \
                                .joinedload(User.posts) \
                                .joinedload(Post.photos)) \
                        .options(joinedload(Relationship.friends) \
                                .joinedload(User.posts) \
                                .joinedload(Post.location)) \
                        .options(joinedload(Relationship.friends) \
                                .joinedload(User.posts) \
                                .joinedload(Post.tagged_friends) \
                                .joinedload(TaggedFriend.users)) \
                        .all()
    print(relationships[0].friends.posts[0].location)
    print(relationships[0].friends.posts[0].photos)
    print(relationships[0].friends.posts[0].tagged_friends)
    data=[]
    for relationship in relationships:
        for post in relationship.friends.posts:
            comments = []
            likes = []
            tagged_people = []
            # photos = []
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

@post_routes.route('/location/<string:value>', methods=['GET'])
@jwt_required
def get_location(value):
    r = requests.get(f'https://api.locationiq.com/v1/autocomplete.php?key={token}&q={value}&tag=place:city')
    data = r.json()
    return jsonify(data=data)

@post_routes.route('/', methods=['POST'])
@jwt_required
def create_post():
    if "photo" not in request.files:
        return "No file key in request.files"
    photo = request.files['profilePicture']
    if photo:
        photo_link = upload_file_to_s3(photo)
        # user.profile_picture = profile_photo_link
    else:
        return "No file key in request.files"
    print(request.files)
    # post_type = request.files


    # relationship = Relationship(user_id=id,
    #                             friend_id=incoming,
    #                             status=1,
    #                             friends_since=date)
    # db.session.add(relationship)
    db.session.commit()
    
    return "done"