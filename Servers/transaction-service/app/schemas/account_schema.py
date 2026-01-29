from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime

class CreateAccountRequest(BaseModel):
    email: EmailStr
    holder_name: str
    account_number: str
    pin: str = Field(..., min_length=4, max_length=6) 

class AccountResponse(BaseModel):
    account_number: str
    holder_name: str
    email: EmailStr
    
class TokenPayload(BaseModel):
    sub: str
    exp: int
    email: Optional[EmailStr] = None
    
class BalanceCheckRequest(BaseModel):
    pin: str = Field(..., min_length=4, max_length=4)
    
class BalanceResponse(BaseModel):
    account_number: str
    balance: float


class AccountVerificationResponse(BaseModel):
    holder_name: str
