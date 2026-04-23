from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.repositories.audit_repository import get_audit_logs_paginated


def create_audit_log(
    db: Session,
    usuario_id: int,
    accion: str,
    entidad: str,
    entidad_id: int,
    detalle: str | None = None,
) -> AuditLog:
    audit_log = AuditLog(
        usuario_id=usuario_id,
        accion=accion,
        entidad=entidad,
        entidad_id=entidad_id,
        detalle=detalle,
    )

    db.add(audit_log)
    return audit_log

from app.repositories.audit_repository import get_audit_logs_paginated


def list_audit_logs_service(
    db,
    fecha_desde: str | None = None,
    fecha_hasta: str | None = None,
    usuario_id: int | None = None,
    accion: str | None = None,
    page: int = 1,
    page_size: int = 50,
):
    total, logs = get_audit_logs_paginated(
        db,
        fecha_desde=fecha_desde,
        fecha_hasta=fecha_hasta,
        usuario_id=usuario_id,
        accion=accion,
        page=page,
        page_size=page_size,
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [
            {
                "id": log.id,
                "usuario_id": log.usuario_id,
                "accion": log.accion,
                "entidad": log.entidad,
                "entidad_id": log.entidad_id,
                "detalle": log.detalle,
                "fecha": log.fecha,
            }
            for log in logs
        ],
    }