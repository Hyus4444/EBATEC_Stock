from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True