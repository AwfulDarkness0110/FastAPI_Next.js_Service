from fastapi import APIRouter, HTTPException, Request, Depends, status
from aioredis import Redis

import crud
from schemas.token import Token
from utils.headers import get_auth_headers
from utils.token import add_refresh_token_to_redis
from schemas.auth import LoginPayload, RegisterPayload, RefreshPayload
from schemas.response import IPostResponseBase, create_response
from core.security import create_access_token, create_refresh_token
from db.redis import get_redis_client


router = APIRouter()


@router.post("/login")
async def login(
    request: LoginPayload, redis_client: Redis = Depends(get_redis_client)
) -> IPostResponseBase[Token]:
    """Login user and create JWT access and refresh tokens"""

    # Get and check required headers
    forwarded_for, user_agent = get_auth_headers()

    # Authenticate user
    user = await crud.user.authenticate(
        email_or_username=request.email_or_username, password=request.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username, email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user"
        )

    # Create tokens
    access_token = create_access_token(user.username)
    refresh_token = create_refresh_token(user.username)

    # Store refresh token and other metadata in redis
    await add_refresh_token_to_redis(
        redis_client,
        user,
        refresh_token,
        forwarded_for,
        user_agent,
        request.fingerprint,
    )

    data = Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )

    return create_response(data=data, message="User logged in successfully")


@router.post("/register")
async def register(
    request: RegisterPayload, redis_client: Redis = Depends(get_redis_client)
) -> IPostResponseBase[Token]:
    """Register user and create JWT access and refresh tokens"""
    print("register")
    # Get and check required headers
    forwarded_for, user_agent = get_auth_headers()

    print("#step1 => Ge adn check required headers")

    # Validate username and email are unique
    user_exists = await crud.user.email_or_username_exists(
        email=request.email, username=request.username
    )
    print("#step2 => Is exist user?")
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already exists",
        )

    # Create user
    user = await crud.user.create(obj_in=request)

    # Create tokens
    access_token = create_access_token(user.username)
    refresh_token = create_refresh_token(user.username)

    # Store refresh token and other metadata in redis
    await add_refresh_token_to_redis(
        redis_client,
        user,
        refresh_token,
        forwarded_for,
        user_agent,
        request.fingerprint,
    )

    data = Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )

    return create_response(data=data, message="User registered successfully")


@router.post("/refresh")
async def refresh(
    request: RefreshPayload, redis_client: Redis = Depends(get_redis_client)
) -> IPostResponseBase[Token]:
    """Refresh JWT access and refresh tokens"""

    # Get and check required headers
    forwarded_for, user_agent = get_auth_headers()

    pass


@router.post("/logout")
async def logout(request: Request):
    """Logout user and revoke JWT access and refresh tokens"""
    pass
