from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from typing import Optional

class TransferRequest(BaseModel):
    from_account: str = Field(..., min_length=12, max_length=12)
    to_account: str = Field(..., min_length=12, max_length=12)
    amount: Decimal = Field(..., gt=0, description="Amount must be greater than 0")
    pin: str = Field(..., min_length=4, max_length=6)

class TransferResponse(BaseModel):
    reference_id: str
    status: str
    message: str
    transaction_id: Optional[str] = None 
    to_account: str
    receiver_name: Optional[str] = None
    amount: Decimal
    created_at: str

class TransactionHistoryResponse(BaseModel):
    transaction_id: str 
    from_account: str
    to_account: str
    amount: Decimal
    status: str
    created_at: datetime
    receiver_name: str
    settled_at: Optional[datetime] = None

    class Config:
        from_attributes = True #

class TransactionStatusResponse(BaseModel):
    transaction_id: str 
    status: str
    amount: Decimal
    to_account: str
    receiver_name: str
    settled_at: Optional[datetime] = None

    class Config:
        from_attributes = True