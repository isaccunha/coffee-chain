from models.database import SessionLocal, HarvestCreationLog, HarvestAccessLog
from datetime import datetime, timezone, timedelta

BRASILIA_TZ = timezone(timedelta(hours=-3))


class HarvestLogService:
    """Serviço para gerenciar logs de safras na blockchain"""
    
    @staticmethod
    def log_harvest_creation(harvest_id: str, owner_email: str, harvest_data: dict = None):
        """
        Registra a criação de uma nova safra com status 'in_progress'
        """
        db = SessionLocal()
        try:
            # Verifica se já existe log para este harvest_id
            existing = db.query(HarvestCreationLog).filter(
                HarvestCreationLog.harvest_id == harvest_id
            ).first()
            
            if existing:
                return existing
            
            log = HarvestCreationLog(
                harvest_id=harvest_id,
                owner_email=owner_email,
                status="in_progress",
                farm_name=harvest_data["farm_name"],
                location=harvest_data["location"],
                harvest_date=harvest_data["harvest_date"],
                coffee_variety=harvest_data["coffee_variety"],
                altitude=harvest_data["altitude"],
                coffee_bags=harvest_data["coffee_bags"],
                processing_method=harvest_data["processing_method"],
                notes=harvest_data["notes"],
                created_at=datetime.now(BRASILIA_TZ)
            )
            db.add(log)
            db.commit()
            db.refresh(log)
            return log
        except Exception as e:
            db.rollback()
            print(f"Erro ao criar log de safra: {e}")
            return None
        finally:
            db.close()
    
    @staticmethod
    def update_harvest_status(harvest_id: str, status: str):
        """
        Atualiza o status de uma safra para 'verified' após mineração
        status pode ser: 'in_progress', 'verified'
        """
        db = SessionLocal()
        try:
            log = db.query(HarvestCreationLog).filter(
                HarvestCreationLog.harvest_id == harvest_id
            ).first()
            
            if not log:
                print(f"Log não encontrado para harvest_id: {harvest_id}")
                return None
            
            log.status = status
            if status == "verified":
                log.verified_at = datetime.now(BRASILIA_TZ)
            
            db.commit()
            db.refresh(log)
            return log
        except Exception as e:
            db.rollback()
            print(f"Erro ao atualizar status da safra: {e}")
            return None
        finally:
            db.close()
    
    @staticmethod
    def log_harvest_access(harvest_id: str, accessor_email: str, harvest_data: dict = None):
        """
        Registra um acesso a uma safra (quando alguém consulta a blockchain)
        """
        db = SessionLocal()
        try:
            log = HarvestAccessLog(
                harvest_id=harvest_id,
                accessor_email=accessor_email,
                farm_name=harvest_data["farm_name"],
                location=harvest_data["location"],
                harvest_date=harvest_data["harvest_date"],
                coffee_variety=harvest_data["coffee_variety"],
                altitude=harvest_data["altitude"],
                coffee_bags=harvest_data["coffee_bags"],
                processing_method=harvest_data["processing_method"],
                notes=harvest_data["notes"],
                accessed_at=datetime.now(BRASILIA_TZ)
            )
            db.add(log)
            db.commit()
            db.refresh(log)
            return log
        except Exception as e:
            db.rollback()
            print(f"Erro ao criar log de acesso: {e}")
            return None
        finally:
            db.close()
    
    @staticmethod
    def get_creation_logs(limit: int = 10):
        """
        Recupera os últimos N logs de criação de safras
        """
        db = SessionLocal()
        try:
            logs = db.query(HarvestCreationLog).order_by(
                HarvestCreationLog.created_at.desc()
            ).limit(limit).all()
            return list(logs) 
        except Exception as e:
            print(f"Erro ao recuperar logs de criação: {e}")
            return []
        finally:
            db.close()
    
    @staticmethod
    def get_access_logs(limit: int = 10):
        """
        Recupera os últimos N logs de acesso
        """
        db = SessionLocal()
        try:
            logs = db.query(HarvestAccessLog).order_by(
                HarvestAccessLog.accessed_at.desc()
            ).limit(limit).all()
            return list(logs)  
        except Exception as e:
            print(f"Erro ao recuperar logs de acesso: {e}")
            return []
        finally:
            db.close()

    @staticmethod
    def get_creation_logs_by_email(email: int, limit: int = 10):
        """
        Recupera os últimos N logs de criação para uma safra específica
        """
        db = SessionLocal()
        try:
            logs = (
                db.query(HarvestCreationLog)
                .filter(HarvestCreationLog.owner_email == email)
                .order_by(HarvestCreationLog.created_at.desc())
                .limit(limit)
                .all()
            )
            return list(logs) 
        except Exception as e:
            print(f"Erro ao recuperar logs de criação para email {email}: {e}")
            return []
        finally:
            db.close()


    @staticmethod
    def get_access_logs_by_email(email: int, limit: int = 10):
        """
        Recupera os últimos N logs de acesso para uma safra específica
        """
        db = SessionLocal()
        try:
            logs = (
                db.query(HarvestAccessLog)
                .filter(HarvestAccessLog.accessor_email == email)
                .order_by(HarvestAccessLog.accessed_at.desc())
                .limit(limit)
                .all()
            )
            return list(logs)  
        except Exception as e:
            print(f"Erro ao recuperar logs de acesso para email {email}: {e}")
            return []
        finally:
            db.close()
