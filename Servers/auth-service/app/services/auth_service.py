from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from nanoid import generate
from app.models.user import User
from app.schemas.user_schema import UserRegister
from app.utils.password_hasher import hash_password, verify_password
from app.utils.jwt_handler import create_access_token


def register_user(db: Session, user_data: UserRegister) -> User:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed_pwd = hash_password(user_data.password)
    user_id = generate(size=16)

    user = User(
        id=user_id,
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pwd,
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user



def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user



def login_user(db: Session, email: str, password: str) -> dict:
    user = authenticate_user(db, email, password)

    token = create_access_token(
        sub=user.id,
        role=user.role
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }



def get_user_by_id(db: Session, user_id: str) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
