from sqlalchemy import Column, TIMESTAMP, JSON, String
from sqlalchemy.sql import func
from app.db import Base

class IdempotencyKey(Base):
    __tablename__ = "idempotency_keys"

    idempotency_key = Column(String, primary_key=True)
    transaction_id = Column(String, nullable=False) 
    response = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), index=True)