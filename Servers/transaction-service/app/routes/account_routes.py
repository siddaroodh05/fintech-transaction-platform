from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.account_schema import CreateAccountRequest, AccountResponse
from app.services.account_service import create_account, get_account_profile
from app.utils.auth_token import get_current_user_id 
router = APIRouter(tags=["Accounts"])

@router.post("/create", response_model=AccountResponse)
def create_user_account(
    account_data: CreateAccountRequest,
    user_id: str = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    account = create_account(db, account_data, user_id)
    return AccountResponse(
        account_number=account.account_number,
        holder_name=account.holder_name,
        email=account.email
    )


@router.get("/me", response_model=AccountResponse, summary="Get account details for logged-in user")
def get_my_account(
    user_id: str = Depends(get_current_user_id),  
    db: Session = Depends(get_db)
):
    account = get_account_profile(db, user_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return AccountResponse(
        account_number=account.account_number,
        holder_name=account.holder_name,
        email=account.email
    )
