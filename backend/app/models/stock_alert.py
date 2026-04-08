from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class StockAlert(Base):
    __tablename__ = "alertas_stock"
    __table_args__ = (UniqueConstraint("producto_id", name="uq_alertas_stock_producto_id"),)

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    activa = Column(Boolean, nullable=False, default=False)
    stock_actual = Column(Integer, nullable=False)
    stock_minimo = Column(Integer, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    producto = relationship("Product")