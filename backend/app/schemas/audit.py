from pydantic import BaseModel
from datetime import datetime


class AuditLogResponse(BaseModel):
    id: int
    usuario_id: int
    accion: str
    entidad: str
    entidad_id: int
    detalle: str | None
    fecha: datetime

    class Config:
        from_attributes = True


class AuditLogPaginatedResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[AuditLogResponse]