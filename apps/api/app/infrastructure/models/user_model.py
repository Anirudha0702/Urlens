import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ...database.database import Base


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"
    super_admin="superAdmin"

class UserPlan(str,enum.Enum):
    free="free"

class UserModel(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True) 
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hash_password = Column(String, nullable=False)
    role = Column(Enum(UserRole, name="user_role", schema="public"), default="user")
    plan = Column(Enum(UserPlan, name="user_plan", schema="public"), default="free")
    is_verified = Column(Boolean, default=False)
    blocked = Column(Boolean,default=False)

    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    


class OAuthModel(Base):
    __tablename__ = "oauth_accounts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    provider = Column(String, nullable=False)
    provider_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

# class FeedbackModel(Base):
#     __tablename__ = "feedbacks"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
#     rating = Column(Float, nullable=False)
#     feedback_text = Column(String, nullable=True)

#     created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


#     user = relationship("UserModel", back_populates="feedbacks")