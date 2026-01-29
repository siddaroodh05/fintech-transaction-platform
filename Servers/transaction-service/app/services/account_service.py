from sqlalchemy.orm import Session
from app.models.account import Account
from app.utils.pin_hash import hash_pin
from app.schemas.account_schema import CreateAccountRequest
from fastapi import HTTPException
from app.utils.pin_hash import verify_pin


def create_account(db: Session, data: CreateAccountRequest, user_id: str):

    existing = db.query(Account).filter_by(user_id=user_id).first()
    if existing:
        raise Exception("Account already exists")

    account = Account(
        user_id=user_id,
        email=data.email,
        holder_name=data.holder_name,
        account_number=data.account_number,
        balance=1000,
        pin_hash=hash_pin(data.pin)
    )

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def get_account_profile(db, user_id):
    return db.query(Account).filter_by(user_id=user_id).first()


def get_account_balance_with_pin(db: Session, user_id: str, pin: str):
    account = db.query(Account).filter(Account.user_id == user_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not verify_pin(pin, account.pin_hash):
        raise HTTPException(status_code=401, detail="Invalid PIN")

    return account

def verify_account_and_get_name(
    db: Session,
    account_number: str
) -> str:
    account = db.query(Account).filter(
        Account.account_number == account_number
    ).first()

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Invalid account details"
        )

    return account.holder_name