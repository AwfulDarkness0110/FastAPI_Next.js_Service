from fastapi import APIRouter, HTTPException, Request, Depends, status
from aioredis import Redis

import crud.user as crud_user
from schemas.token import Token
from utils.headers import get_auth_headers
from utils.token import add_refresh_token_to_redis
from schemas.auth import LoginPayload, RegisterPayload, RefreshPayload, VerifyPayload
from schemas.response import IPostResponseBase, create_response
from core.security import create_access_token, create_refresh_token
from db.redis import get_redis_client

from utils.jwt import get_jwt_identity

router = APIRouter()


# @router.post("/oauth/google")
# async def google(
#     req: any, redis_client: Redis = Depends(get_redis_client)
# ) -> IPostResponseBase[Token]:
#     try:
#         # Get the code from the query
#         code = req.query.get("code")
#         pathUrl = req.query.get("state", "/")

#         # Use the code to get the id and access tokens
#         id_token, access_token = getGoogleOauthToken(code)

#         # Use the token to get the User
#         name, verified_email, email, picture = getGoogleUser(id_token, access_token)

#         # Check if user is verified
#         if not verified_email:
#             return next(AppError("Google account not verified", 403))

#         # Update user if user already exists or create new user
#         user = findAndUpdateUser(
#             {"email": email},
#             {
#                 "name": name,
#                 "photo": picture,
#                 "email": email,
#                 "provider": "Google",
#                 "verified": True,
#             },
#             upsert=True,
#             runValidators=False,
#             new=True,
#             lean=True,
#         )

#         if not user:
#             return res.redirect(config.get("origin") + "/oauth/error")

#         # Create access and refresh token
#         accessToken, refresh_token = signToken(user)

#         # Send cookie
#         res.set_cookie("access_token", accessToken, **accessTokenCookieOptions)
#         res.set_cookie("refresh_token", refresh_token, **refreshTokenCookieOptions)
#         res.set_cookie(
#             "logged_in", "true", **{**accessTokenCookieOptions, "httpOnly": False}
#         )

#         res.redirect(config.get("origin") + pathUrl)
#     except Exception as err:
#         print("Failed to authorize Google User", err)
#         return res.redirect(config.get("origin") + "/oauth/error")

#     pass


@router.post("/login")
async def login(
    request: LoginPayload, redis_client: Redis = Depends(get_redis_client)
) -> IPostResponseBase[Token]:
    """Login user and create JWT access and refresh tokens"""

    print("Backend-login-1")
    # Get and check required headers
    forwarded_for, user_agent = get_auth_headers()

    print("Backend-login-2")

    # print(request.email_or_username, request.password)

    # Authenticate user
    user = await crud_user.user.authenticate(
        email_or_username=request.email_or_username, password=request.password
    )
    print("user", user)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username, email or password",
        )
    # elif not user.status:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user"
    #     )

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
    )

    token = Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )

    user_info = {"username": user.username, "email": user.email, "status": user.status}

    return create_response(data=token, user=user_info)


@router.post("/register")
async def register(
    request: RegisterPayload, redis_client: Redis = Depends(get_redis_client)
) -> IPostResponseBase[Token]:
    """Register user and create JWT access and refresh tokens"""

    # Get and check required headers
    forwarded_for, user_agent = get_auth_headers()

    print("#step1 => Ge adn check required headers")

    # Validate username and email are unique
    user_exists = await crud_user.user.email_or_username_exists(
        email=request.email, username=request.username
    )
    print("#step2 => Is exist user?")
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already exists",
        )

    # Create user
    user = await crud_user.user.create(obj_in=request)

    # Create tokens
    access_token = create_access_token(user.username)
    refresh_token = create_refresh_token(user.username)

    # Store refresh token and other metadata in redis
    await add_refresh_token_to_redis(
        redis_client, user, refresh_token, forwarded_for, user_agent
    )

    data = Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )

    user_info = {"username": user.username, "email": user.email, "status": user.status}

    return create_response(
        data=data, message="User registered successfully", user=user_info
    )


@router.post("/refresh")
async def refresh(
    request: RefreshPayload, redis_client: Redis = Depends(get_redis_client)
) -> IPostResponseBase[Token]:
    """Refresh JWT access and refresh tokens"""
    # Get and check required headers
    forwarded_for, user_agent = get_auth_headers()

    print("refresh start: ", request.refresh_token)
    try:
        username = get_jwt_identity(request.refresh_token)

        user = await crud_user.user.get_by_email_or_username(username)

        # Create tokens
        access_token = create_access_token(username)
        refresh_token = create_refresh_token(username)

        # Store refresh token and other metadata in redis
        await add_refresh_token_to_redis(
            redis_client, user, refresh_token, forwarded_for, user_agent
        )

        data = Token(
            access_token=access_token, refresh_token=refresh_token, token_type="bearer"
        )

        user_info = {
            "username": user.username,
            "email": user.email,
            "status": user.status,
        }

        return create_response(
            data=data, message="Token refresh successfully", user=user_info
        )

        # print('username', username)
    except Exception as E:
        print(E)

    # print("refresh")
    # print(forwarded_for, user_agent)

    # return create_response(data=data, message="User registered successfully", user=user_info)


@router.post("/logout")
async def logout(request: Request):
    """Logout user and revoke JWT access and refresh tokens"""
    pass


@router.post("/verify")
async def verify(
    request: VerifyPayload, redis_client: Redis = Depends(get_redis_client)
) -> IPostResponseBase[Token]:
    forwarded_for, user_agent = get_auth_headers()
    token = request.verify_token

    try:
        username = get_jwt_identity(token)
        # user verify: active => status
        user = await crud_user.user.user_active(username)

        print(user)

        # Create tokens
        access_token = create_access_token(user.username)
        refresh_token = create_refresh_token(user.username)

        # Store refresh token and other metadata in redis
        await add_refresh_token_to_redis(
            redis_client, user, refresh_token, forwarded_for, user_agent
        )

        data = Token(
            access_token=access_token, refresh_token=refresh_token, token_type="bearer"
        )

        user_info = {
            "username": user.username,
            "email": user.email,
            "status": user.status,
        }

        return create_response(
            data=data, message="User Verified successfully", user=user_info
        )

    except Exception as E:
        print(E)
