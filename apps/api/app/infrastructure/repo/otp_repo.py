from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from ...core.repo.otp_repo import OTPRepo
from ...infrastructure.models.otp_model import OTPModel
from ...utils.exceptions import NotFoundExceptionError


class SQLOTPRepo(OTPRepo):
    def __init__(self, db: Session):
        self.db = db

    async def get_otp_by_email(self,email:str)->OTPModel:
        return self.db.query(OTPModel).filter(OTPModel.email== email).first()
    
    async def create_or_update_otp(self, otp)->OTPModel:
        existing_otp_entry=self.db.query(OTPModel).filter(OTPModel.email==otp.email).first()
        if not existing_otp_entry:
            otp_entry=OTPModel(
                email=otp.email,
                otp_hash=otp.otp_hash
            )
            self.db.add(otp_entry)
            self.db.commit()
            self.db.refresh(otp_entry)

            return otp_entry

        existing_otp_entry.otp_hash=otp.otp_hash # type: ignore
        existing_otp_entry.expires_at = datetime.now(UTC) + timedelta(minutes=5) # type: ignore
        
        self.db.add(existing_otp_entry)
        self.db.commit()
        self.db.refresh(existing_otp_entry)

        return existing_otp_entry
        
    async def delete_otp(self, email)->bool:
        existing_otp_entry=self.db.query(OTPModel).filter(OTPModel.email==email).first()
        if not existing_otp_entry:
            raise NotFoundExceptionError(detail="OTP entry not found for this email")
        self.db.delete(existing_otp_entry)
        self.db.commit()
        return True


        
