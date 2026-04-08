from datetime import datetime, time
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def get_audit_logs_paginated(
    db: Session,
    fecha_desde: str | None = None,
    fecha_hasta: str | None = None,
    usuario_id: int | None = None,
    accion: str | None = None,
    page: int = 1,
    page_size: int = 10,
):
    q = db.query(AuditLog)

    if fecha_desde:
        start_dt = datetime.fromisoformat(fecha_desde)
        q = q.filter(AuditLog.fecha >= start_dt)

    if fecha_hasta:
        end_dt = datetime.combine(datetime.fromisoformat(fecha_hasta).date(), time.max)
        q = q.filter(AuditLog.fecha <= end_dt)

    if usuario_id:
        q = q.filter(AuditLog.usuario_id == usuario_id)

    if accion:
        q = q.filter(AuditLog.accion == accion)

    total = q.count()

    items = (
        q.order_by(AuditLog.fecha.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return total, items