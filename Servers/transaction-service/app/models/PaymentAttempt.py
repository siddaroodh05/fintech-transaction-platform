from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
from app.db import Base
from app.utils.Id_generator import generate_attempt_ref
from sqlalchemy import Column, DateTime


class PaymentAttempt(Base):
    __tablename__ = "payment_attempts"

    reference_id = Column(String(16), primary_key=True, default=generate_attempt_ref)
    user_id = Column(String, nullable=False)

    amount = Column(Float, nullable=False)

    to_account = Column(String, nullable=False)
    receiver_name = Column(String, nullable=False)  

    idempotency_key = Column(String, unique=True, nullable=False)

    status = Column(String)  
    error_message = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
