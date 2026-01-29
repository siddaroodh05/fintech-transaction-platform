from sqlalchemy import Column, String, Numeric, TIMESTAMP, JSON,Index
from sqlalchemy.sql import func
from app.utils.Id_generator import generate_transaction_id
from app.db import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=generate_transaction_id)
    idempotency_key = Column(String, nullable=False, unique=True, index=True)
    
    from_account = Column(String(12), nullable=False, index=True)
    to_account = Column(String(12), nullable=False, index=True)
    
    receiver_name = Column(String(100), nullable=False)
    sender_name = Column(String(100), nullable=True)  

    amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), nullable=False, index=True) 
    tx_metadata = Column(JSON, nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    settled_at = Column(TIMESTAMP, nullable=True)
    
    __table_args__ = (
        Index('ix_tx_from_acc_created', 'from_account', 'created_at'),
        Index('ix_tx_to_acc_created', 'to_account', 'created_at'),
    )
