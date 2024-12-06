"""empty message

Revision ID: 887a5f14eb12
Revises: 7e6b03895d7f
Create Date: 2024-11-23 01:32:10.997288

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '887a5f14eb12'
down_revision = '7e6b03895d7f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=30), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('username')

    # ### end Alembic commands ###
