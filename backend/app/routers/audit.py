from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.audit import AuditLogResponse
from app.services.audit_service import list_audit_logs_service

router = APIRouter(prefix="/audit-logs", tags=["Audit"])

@router.get("", response_model=list[AuditLogResponse])
def list_audit_logs(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return list_audit_logs_service(db)