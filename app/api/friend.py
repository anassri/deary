from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, Like, db
from flask_jwt_extended import jwt_required, create_access_token
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, not_


friend_routes = Blueprint('friends', __name__, url_prefix='/api/friends')

@friend_routes.route('/<int:id>', methods=['GET'])
@jwt_required
def get_friends(id):
    friends = Relationship.query \
                            .filter(or_(Relationship.user_id==id, Relationship.friend_id==id)) \
                            .filter(Relationship.status==2) \
                            .all()
    data_1 = [friend.friends.to_dict() for friend in friends if not friend.friends.id == id]
    data_2 = [friend.person.to_dict() for friend in friends if not friend.person.id == id]
    data = [*data_1, *data_2]
    return jsonify(data=data)