from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from typing import Optional
from fastapi import HTTPException, status
from app.config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.user_schema import TokenPayload



def create_access_token(
    sub: str,
    role: str,
    expires_minutes: Optional[int] = None
) -> str:
    if expires_minutes is None:
        expires_minutes = ACCESS_TOKEN_EXPIRE_MINUTES

    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)

    payload = {
        "sub": sub,
        "role": role,
        "exp": expire,   
        "iat": datetime.now(timezone.utc)
    }

    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)



def decode_access_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        if "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        return TokenPayload(**payload)

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
