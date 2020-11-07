from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, Like, db
from flask_jwt_extended import jwt_required, create_access_token
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, not_
from datetime import datetime
import pytz

like_routes = Blueprint('likes', __name__, url_prefix='/api/likes')

@like_routes.route('/<int:id>/add', methods=['POST'])
@jwt_required
def add_like(id):
    incoming = request.get_json()
    like = Like(user_id=id,
                post_id=incoming)

    db.session.add(like)
    db.session.commit()

    return jsonify({"msg": 'Add like successful'})

@like_routes.route('/<int:id>/delete', methods=['POST'])
@jwt_required
def delete_like(id):
    incoming = request.get_json()
    like = Like.query.filter_by(user_id=id, post_id=incoming).first()

    db.session.delete(like)
    db.session.commit()
    return jsonify({"msg": 'Like deleted'})
