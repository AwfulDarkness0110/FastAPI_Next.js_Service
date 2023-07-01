from typing import Optional

from sqlmodel import select
from fastapi_async_sqlalchemy import db
from sqlmodel.ext.asyncio.session import AsyncSession

from db.session import create_tables
from crud.base import CRUDBase
from models.user import User, UserItem
from core.security import verify_password, hash_password
from schemas.user import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def create(
        self, *, obj_in: UserCreate, db_session: Optional[AsyncSession] = None
    ) -> User:
        db_session = db_session or db.session

        # Check if the database is empty
        if await db_session.scalar(select(User)) is None:
            # Create the database here
            await create_tables()

        print(obj_in.username, obj_in.email)

        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            password=hash_password(obj_in.password),
        )
        # db_obj2 = UserItem(
        #     first_name=obj_in.first_name,
        #     last_name= obj_in.last_name
        # )
        db_session.add(db_obj)
        # db_session.add(db_obj2)

        await db_session.commit()
        await db_session.refresh(db_obj)
        return db_obj

    async def authenticate(
        self, *, email_or_username: str, password: str
    ) -> Optional[User]:
        user = await self.get_by_email_or_username(email_or_username=email_or_username)

        if not user:
            return None
        if not verify_password(password, user.password):
            return None

        return user

    async def email_or_username_exists(self, *, email: str, username: str) -> bool:
        user_by_email = await self.get_by_email(email=email)
        user_by_username = await self.get_by_username(username=username)

        # print("step 2-1. get email and username: "+user_by_username+' '+user_by_email)

        if user_by_email or user_by_username:
            return True

        return False

    async def user_active(
        self, username: str, db_session: Optional[AsyncSession] = None
    ) -> Optional[User]:
        db_session = db_session or db.session

        query = select(User).where(User.username == username)
        response = await db_session.execute(query)
        user = response.scalar_one_or_none()

        if user:
            user.status = True
            db_session.commit()
        else:
            print("User Not Founded")

        return user

    @staticmethod
    async def get_by_email_or_username(
        email_or_username: str, db_session: Optional[AsyncSession] = None
    ) -> Optional[User]:
        db_session = db_session or db.session

        query = select(User).where(
            (User.email == email_or_username) | (User.username == email_or_username)
        )
        response = await db_session.execute(query)

        return response.scalar_one_or_none()

    @staticmethod
    async def get_by_username(
        username: str, db_session: Optional[AsyncSession] = None
    ) -> Optional[User]:
        db_session = db_session or db.session
        query = await db_session.execute(select(User).where(User.username == username))
        return query.scalar_one_or_none()

    @staticmethod
    async def get_by_email(
        email: str, db_session: Optional[AsyncSession] = None
    ) -> Optional[User]:
        db_session = db_session or db.session
        print("step 1.2.1 => db_session")
        query = await db_session.execute(select(User).where(User.email == email))
        return query.scalar_one_or_none()


user = CRUDUser(User)
