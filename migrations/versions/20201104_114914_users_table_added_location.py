"""users table added location

Revision ID: ae12e9eaf47d
Revises: 6fa02a81c37a
Create Date: 2020-11-04 11:49:14.275146

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ae12e9eaf47d'
down_revision = '6fa02a81c37a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('city', sa.String(length=50), nullable=True))
    op.add_column('users', sa.Column('country', sa.String(length=50), nullable=True))
    op.add_column('users', sa.Column('state', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'state')
    op.drop_column('users', 'country')
    op.drop_column('users', 'city')
    # ### end Alembic commands ###
