from typing import Union

from pydantic import BaseModel, EmailStr


class AuthPayload(BaseModel):
    pass
    # fingerprint: str


class LoginPayload(AuthPayload):
    email_or_username: Union[EmailStr, str]
    password: str


class RegisterPayload(AuthPayload):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class RefreshPayload(BaseModel):
    refresh_token: str


class VerifyPayload(BaseModel):
    verify_token: str
    resend_verify: Union[bool, None]
    username: Union[str, None]
