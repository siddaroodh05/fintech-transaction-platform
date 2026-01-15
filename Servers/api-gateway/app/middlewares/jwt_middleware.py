from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError, ExpiredSignatureError
from app.config import JWT_SECRET_KEY, JWT_ALGORITHM

class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip auth routes and FastAPI docs/openapi
        if (
            request.url.path.startswith("/auth")
            or request.url.path.startswith("/docs")
            or request.url.path.startswith("/redoc")
            or request.url.path.startswith("/openapi.json")
        ):
            return await call_next(request)

        token = request.headers.get("Authorization")
        if not token or not token.startswith("Bearer "):
            return JSONResponse({"detail": "Unauthorized: Missing or invalid token"}, status_code=401)

        try:
            payload = jwt.decode(token.split(" ")[1], JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            request.state.user = payload  # Store decoded user info for downstream routes
        except ExpiredSignatureError:
            return JSONResponse({"detail": "Token expired"}, status_code=401)
        except JWTError:
            return JSONResponse({"detail": "Invalid token"}, status_code=401)

        return await call_next(request)
