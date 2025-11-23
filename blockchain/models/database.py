from sqlalchemy import create_engine, Column, String, DateTime, Integer, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone
from config import Config

DATABASE_URL = Config.DATABASE_URL
BRASILIA_TZ = timezone(datetime.now().astimezone().utcoffset())

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class HarvestCreationLog(Base):
    """Log de criação de safras na blockchain"""
    __tablename__ = "harvest_creation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    harvest_id = Column(String(255), unique=True, index=True, nullable=False)
    owner_email = Column(String(255), nullable=False)
    status = Column(String(50), default="in_progress", nullable=False)  # in_progress, verified

    farm_name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    harvest_date = Column(String(255), nullable=False)
    coffee_variety = Column(String(255), nullable=False)
    altitude = Column(String(255), nullable=False)
    coffee_bags = Column(Integer, nullable=False)
    processing_method = Column(String(255), nullable=False)
    notes = Column(Text, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(BRASILIA_TZ), nullable=False)
    verified_at = Column(DateTime, nullable=True)
    

class HarvestAccessLog(Base):
    """Log de acesso a safras na blockchain"""
    __tablename__ = "harvest_access_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    harvest_id = Column(String(255), index=True, nullable=False)
    accessor_email = Column(String(255), nullable=False)

    farm_name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    harvest_date = Column(String(255), nullable=False)
    coffee_variety = Column(String(255), nullable=False)
    altitude = Column(String(255), nullable=False)
    coffee_bags = Column(Integer, nullable=False)
    processing_method = Column(String(255), nullable=False)
    notes = Column(Text, nullable=False)

    accessed_at = Column(DateTime, default=lambda: datetime.now(BRASILIA_TZ), nullable=False)


def init_db():
    """Cria todas as tabelas no banco de dados"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Retorna uma sessão de banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
