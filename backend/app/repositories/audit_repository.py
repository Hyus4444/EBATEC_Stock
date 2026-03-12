from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def get_audit_logs(db: Session) -> list[AuditLog]:
    return db.query(AuditLog).order_by(AuditLog.fecha.desc()).all()