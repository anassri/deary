from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import re

db = SQLAlchemy()

class User(db.Model):
  __tablename__ = "users"

  id = db.Column(db.Integer, primary_key = True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  first_name = db.Column(db.String(40), nullable = False)
  last_name = db.Column(db.String(40), nullable = False)
  hashed_password = db.Column(db.String(255), nullable = False)
  profile_picture= db.Column(db.String(255))
  cover_picture= db.Column(db.String(255))
  birthday= db.Column(db.Date)
  created_at = db.Column(db.DateTime, nullable = False)

  # circles = db.relationship('Circle', back_populates='users', secondary='circle_lists')

  def to_dict(self):
    return {
      "id": self.id,
      "firstName": self.first_name,
      "lastName": self.last_name,
      "email": self.email,
      "profilePicture": self.profile_picture,
      "coverPicture": self.cover_picture,
      "birthday": self.birthday,
      "createdAt": self.created_at
    }

  @property
  def password(self):
      return self.hashed_password

  @password.setter
  def password(self, password):
      if not re.match(r"[A-Za-z0-9@#$%^&+=]{8,}", password):
          raise AssertionError(
              "Password must contain 1 capital letter and 1 number")
      if len(password) < 8 or len(password) > 50:
          raise AssertionError(
              "Password must be between 8 and 50 characters")
      self.hashed_password = generate_password_hash(password)

  def check_password(self, password):
        return check_password_hash(self.password, password)

# class Relationship(db.Model):
#   __tablename__ = "relationships"

#   id = db.Column(db.Integer, primary_key = True)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
#   friend_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
#   status = db.Column(db.Integer, nullable=False)
#   friends_since = db.Column(db.DateTime, nullable=False)

#   person = db.relationship("User", foreign_keys=user_id)
#   friends = db.relationship("User", foreign_keys=friend_id)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "user_id": self.user_id,
#       "friend_id": self.friend_id,
#       "status": self.status,
#       "friends_since ": self.friends_since,
#     }

# class PostType(db.Model):
#   __tablename__ = "post_types"

#   id = db.Column(db.Integer, primary_key = True)
#   type = db.Column(db.String(255), nullable = False)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "type": self.type,
#     }

# class Photo(db.Model):
#   __tablename__ = "photos"

#   id = db.Column(db.Integer, primary_key = True)
#   path = db.Column(db.String(255), nullable = False)
#   post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable = False)

#   posts = db.relationship("Post", foreign_keys=post_id, cascade="all, delete")

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "path": self.path,
#       "post_id": self.post_id,
#     }    

# class Video(db.Model):
#   __tablename__ = "videos"

#   id = db.Column(db.Integer, primary_key = True)
#   post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable = False)

#   posts = db.relationship("Post", foreign_keys=post_id, cascade="all, delete")

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "path": self.path,
#       "post_id": self.post_id,
#     }  

# class Comment(db.Model):
#   __tablename__ = "comments"

#   id = db.Column(db.Integer, primary_key = True)
#   comment = db.Column(db.Text, nullable = False)
#   post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable = False)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
#   created_at = db.Column(db.DateTime, nullable = False)

#   post = db.relationship("Post", foreign_keys=post_id, cascade="all, delete")
#   owner = db.relationship("User", foreign_keys=user_id)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "comment": self.comment,
#       "post_id": self.post_id,
#       "user_id": self.user_id,
#       "created_at": self.created_at,
#     } 

# class Like(db.Model):
#   __tablename__ = "likes"

#   id = db.Column(db.Integer, primary_key = True)
#   post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable = False)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)

#   post = db.relationship("Post", foreign_keys=post_id, cascade="all, delete")
#   owner = db.relationship("User", foreign_keys=user_id)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "post_id": self.post_id,
#       "user_id": self.user_id,
#     } 

# class CommentLike(db.Model):
#   __tablename__ = "comment_likes"

#   id = db.Column(db.Integer, primary_key = True)
#   comment_id = db.Column(db.Integer, db.ForeignKey("comments.id"), nullable = False)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)

#   comment = db.relationship("Comment", foreign_keys=comment_id, cascade="all, delete")
#   owner = db.relationship("User", foreign_keys=user_id)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "comment_id": self.comment_id,
#       "user_id": self.user_id,
#     } 

# class MoodType(db.Model):
#   __tablename__ = 'mood_types'

#   id = db.Column(db.Integer, primary_key = True)
#   type = db.Column(db.String(255), nullable = False)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "type": self.type,
#     }

# class Mood(db.Model):
#   __tablename__ = "moods"

#   id = db.Column(db.Integer, primary_key = True)
#   post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable = False)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
#   type_id = db.Column(db.Integer, db.ForeignKey("mood_types.id"), nullable = False)

#   post = db.relationship("Post", foreign_keys=post_id, cascade="all, delete")
#   owner = db.relationship("User", foreign_keys=user_id)
#   type = db.relationship("MoodType", foreign_keys=type_id)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "post_id": self.post_id,
#       "user_id": self.user_id,
#       "type_id": self.type_id,
#     }

# class Post(db.Model):
#   __tablename__ = "posts"

#   id = db.Column(db.Integer, primary_key = True)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
#   description = db.Column(db.Text)
#   type_id = db.Column(db.Integer, db.ForeignKey("post_types.id"), nullable = False)
#   created_at = db.Column(db.DateTime, nullable = False)

#   owner = db.relationship("User", foreign_keys=user_id)
#   type = db.relationship("PostType", foreign_keys=type_id)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "description": self.description,
#       "user_id": self.user_id,
#       "type_id": self.type_id,
#       "created_at": self.created_at,
#     }

# class NotificationType(db.Model):
#   __tablename__ = "notification_types"

#   id = db.Column(db.Integer, primary_key = True)
#   type = db.Column(db.String(255), nullable = False)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "type": self.type,
#     }

# class Notification(db.Model):
#   __tablename__ = "notifications"

#   id = db.Column(db.Integer, primary_key = True)
#   friend_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
#   type_id = db.Column(db.Integer, db.ForeignKey("notification_types.id"), nullable = False)

#   friend = db.relationship("User", foreign_keys=friend_id)
#   owner = db.relationship("User", foreign_keys=user_id)
#   type = db.relationship("NotificationType", foreign_keys=type_id)

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "friend_id": self.friend_id,
#       "user_id": self.user_id,
#       "type_id": self.type_id,
#     }

# class Circle(db.Model):
#   __tablename__ = "circles"

#   id = db.Column(db.Integer, primary_key = True)
#   name = db.Column(db.String(255), nullable = False)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)

#   owner = db.relationship("User", foreign_keys=user_id)
#   users = db.relationship('User', back_populates='circles', secondary='circle_lists')
#   lists = db.relationship('CircleList', cascade="all, delete")

#   def to_dict(self):
#     return {
#       "id": self.id,
#       "name": self.name,
#       "user_id": self.user_id,
#     }

# class CircleList(db.Model):
#   __tablename__ = "circle_lists"

#   id = db.Column(db.Integer, primary_key = True)
#   user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
#   circle_id = db.Column(db.Integer, db.ForeignKey("circles.id"), nullable = False)
  
#   user = db.relationship("User", foreign_keys=user_id, backref=db.backref(
#         'circle_lists', cascade='all'))
#   circle = db.relationship("Circle", foreign_keys=circle_id, backref=db.backref(
#         'circle_lists', cascade='all'))

#   def to_dict(self):
#     return {
#         'id': self.id,
#         'user_id': self.user_id,
#         'circle_id': self.circle_id,
#         'user': self.user.to_dict(),
#     }
