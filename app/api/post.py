from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, db
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
                        .all()
    
    data=[]
    for relationship in relationships:
        for post in relationship.friends.posts:
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

@post_routes.route('/location/<string:value>', methods=['GET'])
@jwt_required
def get_location(value):
    # r = requests.get(f'https://api.locationiq.com/v1/autocomplete.php?key={token}&q={value}&tag=place%3Acity%2Cplace%3Atown%2Cplace%3Avillage')
    r = requests.get(f'https://api.locationiq.com/v1/autocomplete.php?key={token}&q={value}&city={value}')
    data = r.json()
    return jsonify(data=data)