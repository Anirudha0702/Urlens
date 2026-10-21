
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from ..config.config import settings

engine=create_engine(settings.DATABASE_URL)


SessionLocal=sessionmaker(autoflush=False,bind=engine,autocommit=False)

Base = declarative_base()

def get_DB():
    DB = SessionLocal()
    with DB: yield DB