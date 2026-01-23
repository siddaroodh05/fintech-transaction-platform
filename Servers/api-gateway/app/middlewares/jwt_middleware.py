from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from fastapi.responses import JSONResponse
from jose import jwt, JWTError, ExpiredSignatureError
from app.config import JWT_SECRET_KEY, JWT_ALGORITHM

PUBLIC_PATHS = (
    "/", "/health", "/docs", "/redoc", 
    "/openapi.json", "/auth/login", "/auth/register"
)

class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.user_id = None
        request.state.role = None


        if any(request.url.path.startswith(path) for path in PUBLIC_PATHS):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        token = request.cookies.get("access_token")

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return JSONResponse({"detail": "Unauthorized: No token provided"}, status_code=401)

        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])

           
            request.state.user_id = payload.get("sub")
            request.state.role = payload.get("role")


            if not request.state.user_id:
                return JSONResponse({"detail": "Invalid token payload: missing user_id"}, status_code=401)

        except ExpiredSignatureError:
            return JSONResponse({"detail": "Token expired"}, status_code=401)
        except JWTError:
            return JSONResponse({"detail": "Invalid token"}, status_code=401)

        return await call_next(request)