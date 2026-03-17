from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    codigo_interno: str = Field(min_length=1, max_length=50)
    nombre: str = Field(min_length=1, max_length=120)
    descripcion: str | None = None
    categoria_id: int
    stock_minimo: int = Field(ge=0)
    activo: bool = True


class ProductUpdate(BaseModel):
    codigo_interno: str = Field(min_length=1, max_length=50)
    nombre: str = Field(min_length=1, max_length=120)
    descripcion: str | None = None
    categoria_id: int
    stock_minimo: int = Field(ge=0)


class ProductStatusUpdate(BaseModel):
    activo: bool


class ProductResponse(BaseModel):
    id: int
    codigo_interno: str
    nombre: str
    descripcion: str | None
    categoria: str
    stock_actual: int
    stock_minimo: int
    activo: bool

    class Config:
        from_attributes = True