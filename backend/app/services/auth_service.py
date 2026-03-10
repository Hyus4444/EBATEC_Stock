from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.repositories.user_repository import get_user_by_email


def authenticate_user(db: Session, correo: str, password: str):
    user = get_user_by_email(db, correo)

    if not user:
        return None

    if not user.activo:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def build_login_response(user):
    access_token = create_access_token(subject=user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "correo": user.correo,
            "activo": user.activo,
            "rol": user.rol.nombre,
        },
    }