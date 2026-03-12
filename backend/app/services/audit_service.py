from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


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