from abc import ABC, abstractmethod

from ...infrastructure.models.user_model import UserModel

from ..entities.user_entities import (
    InternalUser,
    OAuthUser,
    User,
    UserCreate,
    UserCreateByAdmin,
    UserKPI,
    UserUpdate,
)


class UserRepo(ABC):
    @abstractmethod
    async def create_user(self, user_data: UserCreate) -> User:
        ...

    @abstractmethod
    async def get_all_user(self,skip: int, limit: int = 100 )-> list[UserModel]:
        ...
    
    @abstractmethod
    async def get_user_by_email(self, email: str) -> InternalUser|None:
        ...
    
    @abstractmethod
    async def get_user_by_username(self, username: str) -> InternalUser|None:
        ...

    @abstractmethod
    async def get_user_by_id(self, user_id: str) -> InternalUser|None:
        ...

    @abstractmethod
    async def update_user(self, user_id: str, user_data: UserUpdate) -> User|None:
        ...
    
    @abstractmethod
    async def delete_user(self, user_id: str) -> bool:
        ...

    @abstractmethod
    async def create_user_by_admin(self,user_data:UserCreateByAdmin)->User:
        ...

    @abstractmethod
    async def get_kpi(self)->UserKPI:
        ...

class OAuthRepo(ABC):
    @abstractmethod
    async def create_or_update_oauth_user(self, oauth_user: OAuthUser) -> User:
        ...
    
    @abstractmethod
    async def get_user_by_oauth(self, provider: str, provider_id: str) -> User|None:
        ...