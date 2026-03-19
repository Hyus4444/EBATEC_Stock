from datetime import datetime
from pydantic import BaseModel


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