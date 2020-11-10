from flask import Blueprint, jsonify, request
from app.models import User, Relationship, Post, Comment, Like, db
from flask_jwt_extended import jwt_required, create_access_token
from sqlalchemy.orm import joinedload

friend_routes = Blueprint('friends', __name__, url_prefix='/api/friends')

@friend_routes.route('/<int:id>', methods=['GET'])
@jwt_required
def get_friends(id):
    friends = Relationship.query \
                            .filter(Relationship.user_id==id) \
                            .filter(Relationship.status==2) \
                            .options(joinedload(Relationship.friends)) \
                            .all()
    data = [friend.friends.to_dict() for friend in friends]
        
    return jsonify(data=data)