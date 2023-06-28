from fastapi import Depends, HTTPException, status

from models.user import User


async def get_current_user() -> User:
    pass
