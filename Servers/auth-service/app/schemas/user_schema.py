from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: constr(min_length=3, max_length=50)  
    email: EmailStr


class UserRegister(UserBase):
    password: constr(min_length=6, max_length=72)  


class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: constr(max_length=72)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str
    role: Optional[str] = None
    exp: datetime
    iat: Optional[datetime] = None



class MessageResponse(BaseModel):
    detail: str
    
class RegisterResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    account_number: str


# -----------------------------
# User info returned on login
# -----------------------------
class UserInfo(BaseModel):
    username: str
    email: EmailStr

class LoginResponse(BaseModel):
    message: str
    username: str
    email: EmailStr

