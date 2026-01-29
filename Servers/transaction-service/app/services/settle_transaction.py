from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.transaction_model import Transaction
from app.models.account import Account
from sqlalchemy.sql import func
from app.models.PaymentAttempt import PaymentAttempt


def settle_transaction(tx_id: str):
    db: Session = SessionLocal()
    try:
        # 1. Lock the transaction record
        tx = db.query(Transaction).filter_by(id=tx_id).with_for_update().first()
        
        if not tx or tx.status != "PROCESSING":
            return

        # 2. Lock receiver account
        receiver = db.query(Account).filter_by(account_number=tx.to_account).with_for_update().first()

        if not receiver:
            # REFUND LOGIC
            sender = db.query(Account).filter_by(account_number=tx.from_account).with_for_update().first()
            if sender:
                sender.balance += tx.amount
            
            tx.status = "FAILED"
            tx.tx_metadata = {"reason": "Receiver account no longer exists"}
        else:
            # SUCCESS LOGIC
            receiver.balance += tx.amount
            tx.status = "SUCCESS"
            tx.settled_at = func.now()

        # 3. SYNC ATTEMPT STATUS (Move this AFTER the status changes above)
        attempt = db.query(PaymentAttempt).filter_by(idempotency_key=tx.idempotency_key).first()
        if attempt:
            attempt.status = tx.status 

        db.commit()

    except Exception as e:
        db.rollback()

    finally:
        db.close()