from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.audit import AuditLogPaginatedResponse
from app.services.audit_service import list_audit_logs_service

router = APIRouter(prefix="/audit-logs", tags=["Audit"])


@router.get("", response_model=AuditLogPaginatedResponse)
def list_audit_logs(
    fecha_desde: str | None = Query(default=None),
    fecha_hasta: str | None = Query(default=None),
    usuario_id: int | None = Query(default=None),
    accion: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return list_audit_logs_service(
        db,
        fecha_desde=fecha_desde,
        fecha_hasta=fecha_hasta,
        usuario_id=usuario_id,
        accion=accion,
        page=page,
        page_size=page_size,
    )