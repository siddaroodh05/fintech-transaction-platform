from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.account_schema import CreateAccountRequest, AccountResponse,BalanceResponse, BalanceCheckRequest, AccountVerificationResponse
from app.services.account_service import create_account, get_account_profile, get_account_balance_with_pin, verify_account_and_get_name
from app.utils.auth_token import get_current_user_id 
from app.utils.Id_generator import mask_account_number
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




@router.post(
    "/balance",
    response_model=BalanceResponse,
    summary="Check balance using PIN"
)
def check_balance(
    data: BalanceCheckRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    account = get_account_balance_with_pin(db, user_id, data.pin)

    return BalanceResponse(
        account_number=mask_account_number(account.account_number),
        balance=account.balance
    )


@router.get(
    "/verify",
    response_model=AccountVerificationResponse,
    summary="Verify receiver account before transfer"
)
def verify_receiver_account(
    account_number: str = Query(
        ...,
        min_length=12,
        max_length=12,
        regex="^[0-9]{12}$",
        description="12-digit account number"
    ),
    user_id: str = Depends(get_current_user_id),  # 🔐 TOKEN REQUIRED
    db: Session = Depends(get_db)
):
    holder_name = verify_account_and_get_name(db, account_number)

    return {
        "holder_name": holder_name
    }
