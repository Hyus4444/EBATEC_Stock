from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.schemas.auth import AuthUserResponse, LoginRequest, LoginResponse
from app.services.auth_service import authenticate_user, build_login_response


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.correo, payload.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas o usuario inactivo",
        )

    return build_login_response(user)

@router.get("/me", response_model=AuthUserResponse)
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nombre": current_user.nombre,
        "correo": current_user.correo,
        "activo": current_user.activo,
        "rol": current_user.rol.nombre,
    }