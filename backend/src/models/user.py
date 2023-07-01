from sqlalchemy import Column, Boolean, Integer, String, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    username = Column(String(25), unique=True, index=True)
    # first_name = Column(String(25), index=True)
    # last_name = Column(String(80), index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String())
    status = Column(Boolean, default=False)
    role = Column(
        String,
        CheckConstraint("role IN ('admin', 'client', 'operator')"),
        default="client",
    )


class UserItem(Base):
    __tablename__ = "user_items"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    user = relationship("User", backref="user_items")
    address = Column(String, nullable=False)
    phone_no = Column(String, nullable=False)
