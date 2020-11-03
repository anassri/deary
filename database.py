from dotenv import load_dotenv
load_dotenv()

from app import app, db
from app.models import User
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

  db.session.add(ian)
  db.session.add(javier)
  db.session.add(dean)
  db.session.add(angela)
  db.session.add(soonmi)
  db.session.add(alissa)

  db.session.commit()