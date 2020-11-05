import os

class Config:
  SECRET_KEY=os.environ.get('SECRET_KEY')
  SQLALCHEMY_TRACK_MODIFICATIONS=False
  SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL')
  SQLALCHEMY_ECHO=True
  JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
  JWT_ACCESS_TOKEN_EXPIRES = 604800
  JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
  JWT_BLACKLIST_ENABLED = True
  S3_KEY=os.environ.get('S3_ACCESS_ID')
  S3_SECRET=os.environ.get('S3_SECRET')
  S3_BUCKET=os.environ.get('S3_BUCKET')
