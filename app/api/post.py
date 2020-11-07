from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, db
from flask_jwt_extended import jwt_required, create_access_token
from app.aws_s3 import upload_file_to_s3
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, not_
from datetime import datetime

post_routes = Blueprint('posts', __name__, url_prefix='/api/posts')

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
                        .all()
    
    data=[]
    for relationship in relationships:
        for post in relationship.friends.posts:
            comments = []
            for comment in post.comments:
                comm = {**comment.to_dict(), "owner": comment.owner.to_dict()}
                comments.append(comm)
            dic = {**post.to_dict(),
                "comments": comments,
                "type": post.type.to_dict(),
                "owner": post.owner.to_dict()}
            data.append(dic)
        

    return jsonify(data=data)