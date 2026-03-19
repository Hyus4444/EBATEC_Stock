from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    rol = relationship("Role", back_populates="usuarios")