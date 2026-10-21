from abc import ABC, abstractmethod

from ..entities.otp_entities import OTP, OTPCreate
from ...infrastructure.models.otp_model import OTPModel

class OTPRepo(ABC):
    @abstractmethod
    async def create_or_update_otp(self,otp:OTPCreate)->OTPModel:
        ...
        
    @abstractmethod
    async def delete_otp(self,email:str)->bool:
        ...
    
    @abstractmethod
    async def get_otp_by_email(self,email:str)->OTPModel:
        ...