from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, db
from flask_jwt_extended import jwt_required, create_access_token
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, not_
from datetime import datetime
import pytz

comment_routes = Blueprint('comments', __name__, url_prefix='/api/comments')

def query_comments(id):
    comments = Comment.query \
                        .filter(Comment.post_id==id) \
                        .options(joinedload(Comment.owner)) \
                        .order_by(Comment.created_at.desc()) \
                        .all()
    data = [{**comment.to_dict(), "owner": comment.owner.to_dict()} for comment in comments]
    return data

@comment_routes.route('/<int:id>/create', methods=['POST'])
@jwt_required
def create_comment(id):
    incoming = request.get_json()
    comment = Comment(user_id=id,
                            post_id=incoming["postId"],
                            comment=incoming["comment"],
                            created_at=incoming["created_at"])
    db.session.add(comment)
    db.session.commit()

    data = query_comments(incoming["postId"])
    return jsonify(data=data)

@comment_routes.route('/<int:id>', methods=['GET'])
@jwt_required
def find_comments(id):
    data = query_comments(id)
    return jsonify(data=data)

@comment_routes.route('/<int:id>/delete', methods=['DELETE'])
@jwt_required
def delete_comments(id):
    comment = Comment.query.get(id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"msg": f'{comment.comment} deleted'})

@comment_routes.route('/<int:id>/edit', methods=['POST'])
@jwt_required
def edit_comments(id):
    incoming = request.get_json()
    comment = Comment.query.get(id)
    comment.comment = incoming; 
    db.session.commit()
    return jsonify({"msg": f'{comment.comment} edit successful'})