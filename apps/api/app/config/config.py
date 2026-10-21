

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    BACKEND_CORS_ORIGINS: list =Field(init=False)
    DATABASE_URL: str =Field(init=False)
    SUPER_ADMIN_EMAIL:str =Field(init=False)
    FRONTEND_URL:str =Field(init=False)
    BACKEND_URL:str =Field(init=False)
    SECRET_KEY:str=Field(init=False)
    ALGORITHM:str=Field(init=False)
    BREVO_API_KEY:str=Field(init=False)
    EMAIL:str=Field(init=False)
    model_config = SettingsConfigDict(env_file=".env",env_file_encoding="utf-8")


settings = Settings()