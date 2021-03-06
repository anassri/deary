"""notification table added created at column

Revision ID: 24d19aea28bb
Revises: 7dbe41fe888d
Create Date: 2020-11-12 18:19:12.234851

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '24d19aea28bb'
down_revision = '7dbe41fe888d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notifications', sa.Column('created_at', sa.String(length=100), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('notifications', 'created_at')
    # ### end Alembic commands ###
