from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from nanoid import generate

from app.models.user import User
from app.schemas.user_schema import RegisterResponse, UserRegister
from app.utils.password_hasher import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.utils.generate_account_number import generate_account_number


def register_user(db: Session, user_data: UserRegister):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")

    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=409, detail="Username already taken")

    user_id = generate(size=16)
    hashed_pwd = hash_password(user_data.password)

    user = User(
        id=user_id,
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pwd,
        role="user",
        is_active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    account_number = generate_account_number()

    return RegisterResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        account_number=account_number
    )


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return user


def login_user(db: Session, email: str, password: str) -> dict:
    user = authenticate_user(db, email, password)

    token = create_access_token(sub=user.id, role=user.role)

    return {
        "token": token,
        "username": user.username,
        "email": user.email
    }
