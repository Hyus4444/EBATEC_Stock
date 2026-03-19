from datetime import datetime
from pydantic import BaseModel, Field


class MovementItem(BaseModel):
    producto_id: int
    cantidad: int = Field(gt=0)
    motivo: str = Field(min_length=1, max_length=50)


class MovementRequest(BaseModel):
    items: list[MovementItem]
    observacion: str | None = None


class AdjustInventoryRequest(BaseModel):
    producto_id: int
    tipo_ajuste: str
    cantidad: int = Field(gt=0)
    justificacion: str = Field(min_length=1)
    observacion: str | None = None


class InventoryMovementResponse(BaseModel):
    id: int
    id_operacion: str
    producto_id: int
    usuario_id: int
    tipo_movimiento: str
    motivo: str
    cantidad: int
    observacion: str | None
    fecha_hora: datetime

    class Config:
        from_attributes = True