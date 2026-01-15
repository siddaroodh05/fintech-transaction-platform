from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(21), primary_key=True, index=True)  # NanoID
    username = Column(String(50), unique=True, index=True, nullable=False)  # NEW
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
