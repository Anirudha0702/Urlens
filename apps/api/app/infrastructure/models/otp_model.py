import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID

from ...database.database import Base


class OTPModel(Base):
    __tablename__ = "otp_lookup"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, index=True, nullable=False, unique=True)
    otp_hash = Column(String, nullable=False)         
    expires_at = Column(DateTime, default=lambda: datetime.now(UTC) + timedelta(minutes=5))
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))