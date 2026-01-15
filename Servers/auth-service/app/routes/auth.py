from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer


from app.schemas.user_schema import (
    UserRegister,
    UserResponse,
    UserLogin,
    TokenResponse,
    MessageResponse
)
from app.services import auth_service
from app.db import get_db
from app.utils.jwt_handler import decode_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

bearer_scheme = HTTPBearer()


@router.post(
    "/register",
    response_model=UserResponse,
    responses={400: {"model": MessageResponse}}
)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        user = auth_service.register_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post(
    "/login",
    response_model=TokenResponse,
    responses={401: {"model": MessageResponse}}
)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    return auth_service.login_user(
        db,
        user_data.email,
        user_data.password
    )



# -----------------------------
# Get Current User
# -----------------------------
@router.get(
    "/me",
    response_model=UserResponse,
    responses={401: {"model": MessageResponse}, 404: {"model": MessageResponse}}
)
def get_me(
    token: str = Security(bearer_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token.credentials)

    user = auth_service.get_user_by_id(db, payload.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user
