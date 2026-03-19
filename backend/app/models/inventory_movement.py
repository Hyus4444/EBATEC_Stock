from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class InventoryMovement(Base):
    __tablename__ = "movimientos_inventario"

    id = Column(Integer, primary_key=True, index=True)
    id_operacion = Column(String(50), nullable=False, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo_movimiento = Column(String(20), nullable=False)
    motivo = Column(String(50), nullable=False)
    cantidad = Column(Integer, nullable=False)
    observacion = Column(Text, nullable=True)
    fecha_hora = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    producto = relationship("Product")
    usuario = relationship("User")