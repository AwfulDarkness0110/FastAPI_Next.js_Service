from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette_context import middleware, plugins
from fastapi_async_sqlalchemy import SQLAlchemyMiddleware

from api.api_v1.api import api_router
from core.config import settings

from db.url import get_sqlalchemy_url

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS handling
origins = [
    settings.FRONTEND_API,
]

# DB Handling
app.add_middleware(
    SQLAlchemyMiddleware,
    db_url=get_sqlalchemy_url(),
    engine_args={
        "echo": False,
        "pool_pre_ping": True,
        "pool_size": settings.SQLALCHEMY_POOL_SIZE,
        "max_overflow": settings.SQLALCHEMY_MAX_OVERFLOW,
    },
)

# Client's IP and Address
app.add_middleware(
    middleware.ContextMiddleware,
    plugins=(plugins.ForwardedForPlugin(), plugins.UserAgentPlugin()),
)

# CORS handling
# - Be Explicit with Allowed Origins for now will be only FRONTEND_API.
# - Handle Preflight Requests.
# - Consider a Content Security Policy (CSP) use Starlette middleware to add the CSP headers to your responses with allow_origins=["FRONTEND_API"].

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add api router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, port=15000, proxy_headers=True, log_level="debug")
