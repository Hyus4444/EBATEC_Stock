from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol_id: int
    activo: bool = True


class UserCreate(BaseModel):
    nombre: str
    correo: EmailStr
    password: str
    rol_id: int
    activo: bool = True


class UserUpdate(BaseModel):
    nombre: str
    correo: EmailStr
    rol_id: int


class UserStatusUpdate(BaseModel):
    activo: bool


class UserResponse(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    activo: bool
    rol: str

    class Config:
        from_attributes = True