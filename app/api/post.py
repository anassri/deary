from flask import Blueprint, jsonify, request
from app.models import User, Relationship, PostType, Post, Comment, TaggedFriend, Photo, Location, db
from flask_jwt_extended import jwt_required, create_access_token
from app.aws_s3 import upload_file_to_s3
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, not_
from datetime import datetime
from app.config import Config
import requests


post_routes = Blueprint('posts', __name__, url_prefix='/api/posts')

token = Config.GEOCODING_TOKEN

# grab all posts of friends of user and user's post and all their relatationships
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
    posts = Post.query \
                .filter(Post.user_id==id) \
                .options(joinedload(Post.comments) \
                          .joinedload(Comment.owner)) \
                .options(joinedload(Post.type)) \
                .options(joinedload(Post.likes)) \
                .options(joinedload(Post.photos)) \
                .options(joinedload(Post.tagged_friends)) \
                .all()
    
    user_data=[]
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
        user_data.append(dic)

    friends_data=[]
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
            friends_data.append(dic)
        
    data = [*friends_data, *user_data]
    return jsonify(data=data)

# Grab locations autocomplete through external api
@post_routes.route('/location/<string:value>', methods=['GET'])
@jwt_required
def get_location(value):
    r = requests.get(f'https://api.locationiq.com/v1/autocomplete.php?key={token}&q={value}&tag=place:city')
    data = r.json()
    return jsonify(data=data)

# Create a post
@post_routes.route('/', methods=['POST'])
@jwt_required
def create_post():
    post_type = request.form['post_type']
    description = request.form['description']
    user_id = int(request.form['user_id'])
    created_at = request.form['created_at']

    post_type_rec = PostType.query.filter(PostType.type==post_type).first()
    
    # post = Post(user_id=user_id,
    #             description=description,
    #             type_id=post_type_rec.id,
    #             created_at=created_at)
    # if "location" in request.form:
    #     post.location = Location(location=request.form['location'])

    # if "photo" in request.files:
    #     photo = request.files['photo']
    #     photo_link = upload_file_to_s3(photo)
    #     post.photos = Photo(path=photo_link)

    # if "tagged_friends" in request.form:
    #     tagged_friends = request.form['tagged_friends']
    #     friends = tagged_friends.split(',')
    #     friends_list = []
    #     for friend in friends:
    #         print(friend)
    #         friend_id = int(friend)
    #         tagged_friend = TaggedFriend(user_id=friend_id)
    #         friends_list.append(tagged_friend)
    #     post.tagged_friends = friends_list

    if "location" in request.form:
        location = request.form['location']
        location_rec = Location(location=location)
        db.session.add(location_rec) 
        db.session.commit()
        location_id = location_rec.id
    else:
        location_id = None

    post = Post(user_id=user_id,
                description=description,
                type_id=post_type_rec.id,
                created_at=created_at,
                location_id=location_id )

    db.session.add(post) 
    db.session.commit()

    if "photo" in request.files:
        photo = request.files['photo']
        photo_link = upload_file_to_s3(photo)
        photo_rec = Photo(path=photo_link,
                            post_id=post.id)
        db.session.add(photo_rec) 

    if "tagged_friends" in request.form:
        tagged_friends = request.form['tagged_friends']
        friends = tagged_friends.split(',')
        for friend in friends:
            print(friend)
            friend_id = int(friend)
            tagged_friend = TaggedFriend(user_id=friend_id,
                                            post_id=post.id)
            db.session.add(tagged_friend) 
            db.session.commit()
            
    # db.session.add(post) 
    db.session.commit()

    return "done"

@post_routes.route('/<int:id>/delete', methods=['DELETE'])
@jwt_required
def delete_post(id):
    post = Post.query.get(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"msg": 'Post deleted'})