from datetime import datetime
from pydantic import BaseModel


class StockAlertResponse(BaseModel):
    id: int
    producto_id: int
    codigo_interno: str
    nombre: str
    stock_actual: int
    stock_minimo: int
    updated_at: datetime

    class Config:
        from_attributes = True