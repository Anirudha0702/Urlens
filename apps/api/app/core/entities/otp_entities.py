from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class OTP(BaseModel):
    id:UUID
    email:str
    otp_hash:str
    created_at:datetime
    expires_at:datetime
    class Config:
        from_attributes = True

class OTPCreate(BaseModel):
    email:str
    otp_hash:str