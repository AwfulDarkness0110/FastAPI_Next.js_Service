from sqlalchemy import Column, Boolean, Integer, String

from src.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(25), unique=True, index=True)
    first_name = Column(String(25), index=True)
    last_name = Column(String(80), index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String())
    is_active = Column(Boolean, default=True)


class UserItem(Base):
    __tablename__ = "user_items"

    user_id = Column(String, primary_key=True)
    full_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone_no = Column(String, nullable=False)
