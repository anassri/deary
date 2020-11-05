from dotenv import load_dotenv
load_dotenv()

from app import app, db
from app.models import User, Relationship
from datetime import datetime

with app.app_context():
  db.drop_all()
  db.create_all()

  ian = User(first_name = 'Ian', last_name='james', password='password', created_at=datetime.now(),email = 'ian@aa.io')
  javier = User(first_name = 'Javier', last_name='james', password='password', created_at=datetime.now(),email = 'javier@aa.io')
  dean = User(first_name = 'Dean', last_name='james', password='password', created_at=datetime.now(),email = 'dean@aa.io')
  angela = User(first_name = 'Angela', last_name='james', password='password', created_at=datetime.now(),email = 'angela@aa.io')
  soonmi = User(first_name = 'Soon-Mi', last_name='james', password='password', created_at=datetime.now(),email = 'soonmi@aa.io')
  alissa = User(first_name = 'Alissa', last_name='james', password='password', created_at=datetime.now(),email = 'alissa@aa.io')
  ammar = User(first_name = 'ammar', last_name='nassri', password='password', created_at=datetime.now(),email = 'ammar@gmail.com', city="Atlanta", state="GA", country="USA", bio="this is me, deal with it")

  relationship1 = Relationship(user_id=7,friend_id=1, status=1, friends_since=datetime.now())
  relationship2 = Relationship(user_id=7,friend_id=2, status=2, friends_since=datetime.now())
  relationship3 = Relationship(user_id=7,friend_id=3, status=2, friends_since=datetime.now())
  relationship4 = Relationship(user_id=7,friend_id=4, status=3, friends_since=datetime.now())
 
  db.session.add(ian)
  db.session.add(javier)
  db.session.add(dean)
  db.session.add(angela)
  db.session.add(soonmi)
  db.session.add(alissa)
  db.session.add(ammar)

  db.session.add(relationship1)
  db.session.add(relationship2)
  db.session.add(relationship3)
  db.session.add(relationship4)

  db.session.commit()