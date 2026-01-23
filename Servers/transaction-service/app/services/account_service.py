from sqlalchemy.orm import Session
from app.models.account import Account
from app.utils.pin_hash import hash_pin
from app.schemas.account_schema import CreateAccountRequest

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
