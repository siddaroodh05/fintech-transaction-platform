from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from fastapi.security import APIKeyCookie
from jose import JWTError

from app.schemas.user_schema import (
    UserRegister,
    UserResponse,
    UserLogin,
    RegisterResponse,
    LoginResponse
)
from app.services import auth_service
from app.db import get_db
from app.utils.jwt_handler import create_access_token, decode_access_token
from app.models.user import User

cookie_scheme = APIKeyCookie(name="access_token", auto_error=False)

router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
def register(
    user_data: UserRegister,
    response: Response,
    db: Session = Depends(get_db)
):
    result = auth_service.register_user(db, user_data)
    token = create_access_token(sub=result.id, role="user")

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        path="/",
        max_age=3600
    )

    return result


@router.post(
    "/login",
    response_model=LoginResponse,
    response_model_exclude_unset=False,
    response_model_exclude_none=False
)
def login(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    result = auth_service.login_user(db, user_data.email, user_data.password)
    token = result["token"]

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=3600,
        path="/"
    )

    return LoginResponse(
        message="Login successful",
        username=result["username"],
        email=result["email"]
    )



def get_current_user(
    access_token: str = Depends(cookie_scheme),
    db: Session = Depends(get_db)
) -> User:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_access_token(access_token)
    user = db.get(User, payload.sub)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user



@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return user
