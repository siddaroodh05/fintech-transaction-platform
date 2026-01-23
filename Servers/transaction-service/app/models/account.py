from sqlalchemy import Column, String, Numeric, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.db import Base

class Account(Base):
    __tablename__ = "accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(21), nullable=False, index=True)  # NanoID from Auth Service
    email = Column(String(150), nullable=False)
    holder_name = Column(String(100), nullable=False)
    account_number = Column(String(12), unique=True, nullable=False)
    balance = Column(Numeric(12, 2), default=0)
    pin_hash = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
