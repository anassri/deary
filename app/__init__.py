import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, get_raw_jwt


from app.models import db, User
from .api import user
from .api import post
from .api import comment
from .api import friend
from .api import like
from .routes import auth

from app.config import Config

app = Flask(__name__)

app.config.from_object(Config)
app.register_blueprint(user.user_routes)
app.register_blueprint(post.post_routes)
app.register_blueprint(like.like_routes)
app.register_blueprint(friend.friend_routes)
app.register_blueprint(comment.comment_routes)
app.register_blueprint(auth.auth_routes)

db.init_app(app)
migrate = Migrate(app, db)

jwt = JWTManager(app)

blacklist = set()

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist


@app.route('/logout', methods=['DELETE'])
@jwt_required
def logout():
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return {'msg': 'Logged out'}, 200


@app.route('/verify_token', methods=['GET'])
@jwt_required
def verify_token():
    return {'msg': 'OK'}, 200

## Application Security
CORS(app)
@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')

@app.route('/api/csrf/restore')
def restore_csrf():
    return {'csrf_token': generate_csrf()}


# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if not request.is_json:
#         return jsonify({"msg": "Missing JSON in request"}), 400

#     username = request.json.get('username', None)
#     password = request.json.get('password', None)

#     if not username or not password:
#         return {"errors": ["Missing required parameters"]}, 400

#     authenticated, user = User.authenticate(username, password)
#     print(authenticated)
#     print(user)
#     if authenticated:
#         login_user(user)
#         return {"current_user_id": current_user.id}

#     return {"errors": ["Invalid username or password"]}, 401