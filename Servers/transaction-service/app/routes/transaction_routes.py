from fastapi import APIRouter, Depends, HTTPException, Header, BackgroundTasks, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import timedelta
from zoneinfo import ZoneInfo

from app.db import get_db
from app.models.account import Account
from app.models.transaction_model import Transaction
from app.models.PaymentAttempt import PaymentAttempt
from app.models.idempotency_model import IdempotencyKey
from app.schemas.transaction_schema import TransferRequest, TransferResponse, TransactionStatusResponse
from app.utils.auth_token import get_current_user_id
from app.utils.pin_hash import verify_pin
from app.utils.Id_generator import to_ist, mask_account_number, to_naive_utc
from app.services.settle_transaction import settle_transaction

router = APIRouter(tags=["Transactions"])
IST = ZoneInfo("Asia/Kolkata")


@router.post("/transfer", response_model=TransferResponse)
def transfer_money(
    data: TransferRequest,
    background_tasks: BackgroundTasks,
    idempotency_key: str = Header(...),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    amount_float = float(data.amount)

    existing = db.query(IdempotencyKey).filter_by(idempotency_key=idempotency_key).first()
    if existing:
        return existing.response  # idempotency check

    receiver = db.query(Account).filter_by(account_number=data.to_account).first()
    if not receiver:
        raise HTTPException(400, "Receiver account not found")  # validate receiver

    receiver_name = receiver.holder_name
    attempt = PaymentAttempt(
        user_id=user_id,
        amount=amount_float,
        to_account=data.to_account,
        receiver_name=receiver_name,
        idempotency_key=idempotency_key,
        status="INITIATED"
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    try:
        with db.begin_nested():
            sender = db.query(Account).filter(Account.user_id == user_id).with_for_update().first()
            if not sender:
                raise ValueError("Sender account not found")  # validate sender

            if not verify_pin(data.pin, sender.pin_hash):
                raise ValueError("Invalid PIN")  # verify PIN

            if sender.balance < data.amount:
                raise ValueError("Insufficient balance")  # check balance

            sender.balance -= data.amount  # debit sender

            tx = Transaction(
                from_account=sender.account_number,
                to_account=data.to_account,
                receiver_name=receiver_name,
                sender_name=sender.holder_name,
                amount=data.amount,
                status="PROCESSING",
                idempotency_key=idempotency_key
            )
            db.add(tx)
            db.flush()

            response_data = {
                "transaction_id": tx.id,
                "reference_id": attempt.reference_id,
                "status": "PROCESSING",
                "message": "Payment is being processed",
                "to_account": mask_account_number(data.to_account),
                "receiver_name": receiver_name,
                "amount": float(data.amount),
                "created_at": to_ist(attempt.created_at)
            }

            attempt.status = "PROCESSING"
            db.add(IdempotencyKey(idempotency_key=idempotency_key, transaction_id=tx.id, response=response_data))

        db.commit()
        background_tasks.add_task(settle_transaction, tx.id)  # trigger background settlement

        return response_data

    except ValueError as e:
        db.rollback()
        attempt.status = "FAILED"
        attempt.error_message = str(e)
        db.commit()
        raise HTTPException(
            status_code=400,
            detail={
                "reference_id": attempt.reference_id,
                "status": "FAILED",
                "message": str(e),
                "to_account": mask_account_number(data.to_account),
                "receiver_name": receiver_name,
                "amount": float(data.amount),
                "created_at": to_ist(attempt.created_at)
            }
        )

    except Exception:
        db.rollback()
        attempt.status = "ERROR"
        attempt.error_message = "Internal Server Error"
        db.commit()
        raise HTTPException(500, f"Transaction failed. Reference: {attempt.reference_id}")


@router.get("/history")
def get_transaction_history(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
    since: str | None = Query(None),
    before: str | None = Query(None),
    limit: int = 50
):
    account = db.query(Account.account_number).filter_by(user_id=user_id).first()
    if not account:
        return []

    my_acc = account.account_number
    masked_my_acc = "X" * (len(my_acc) - 4) + my_acc[-4:]
    history = []

    since_dt = to_naive_utc(since) if since else None
    before_dt = to_naive_utc(before) if before else None
    if since_dt:
        since_dt -= timedelta(seconds=2)

    query = db.query(Transaction).filter(or_(Transaction.from_account == my_acc, Transaction.to_account == my_acc))

    if since_dt:
        query = query.filter(
            or_(
                Transaction.settled_at > since_dt,
                and_(Transaction.settled_at.is_(None), Transaction.created_at > since_dt)
            )
        )

    if before_dt:
        query = query.filter(
            or_(
                Transaction.settled_at < before_dt,
                and_(Transaction.settled_at.is_(None), Transaction.created_at < before_dt)
            )
        )

    transactions = query.order_by(Transaction.settled_at.desc().nullslast(), Transaction.created_at.desc()).limit(limit).all()

    for tx in transactions:
        is_debit = tx.from_account == my_acc
        ts = tx.settled_at or tx.created_at
        history.append({
            "id": tx.id,
            "type": "DEBIT" if is_debit else "CREDIT",
            "name": tx.receiver_name if is_debit else tx.sender_name,
            "acc": masked_my_acc,
            "status": tx.status,
            "amount": float(tx.amount),
            "date": to_ist(ts),
            "sort_ts": ts
        })

    failed = db.query(PaymentAttempt).filter(PaymentAttempt.user_id == user_id, PaymentAttempt.status.in_(["FAILED", "ERROR"]))
    if since_dt:
        failed = failed.filter(PaymentAttempt.created_at > since_dt)
    if before_dt:
        failed = failed.filter(PaymentAttempt.created_at < before_dt)

    for att in failed.order_by(PaymentAttempt.created_at.desc()).limit(limit):
        history.append({
            "id": att.reference_id,
            "type": "DEBIT",
            "name": att.receiver_name,
            "acc": masked_my_acc,
            "status": att.status,
            "amount": float(att.amount),
            "date": to_ist(att.created_at),
            "sort_ts": att.created_at
        })

    history.sort(key=lambda x: x["sort_ts"], reverse=True)
    for h in history:
        h.pop("sort_ts")

    return history[:limit]


@router.get("/{tx_id}", response_model=TransactionStatusResponse)
def get_transaction_status(
    tx_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter_by(id=tx_id).first()
    if not tx:
        raise HTTPException(404, "Transaction not found")  # transaction exists

    user_account = db.query(Account).filter(Account.user_id == user_id).first()
    if not user_account or (tx.from_account != user_account.account_number and tx.to_account != user_account.account_number):
        raise HTTPException(404, "Transaction not found")  # verify ownership

    return TransactionStatusResponse(
        transaction_id=tx.id,
        status=tx.status,
        amount=tx.amount,
        to_account=mask_account_number(tx.to_account),
        receiver_name=tx.receiver_name,
        settled_at=tx.settled_at
    )
