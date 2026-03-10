from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.repositories.role_repository import get_role_by_id
from app.repositories.user_repository import (
    get_all_users,
    get_user_by_email,
    get_user_by_id,
)


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "nombre": user.nombre,
        "correo": user.correo,
        "activo": user.activo,
        "rol": user.rol.nombre,
    }


def list_users_service(db: Session) -> list[dict]:
    users = get_all_users(db)
    return [serialize_user(user) for user in users]


def get_user_or_404(db: Session, user_id: int) -> User:
    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    return user


def create_user_service(db: Session, payload) -> dict:
    existing_user = get_user_by_email(db, payload.correo)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese correo",
        )

    role = get_role_by_id(db, payload.rol_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rol no encontrado",
        )

    user = User(
        nombre=payload.nombre,
        correo=payload.correo,
        password_hash=hash_password(payload.password),
        activo=payload.activo,
        rol_id=payload.rol_id,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    db.refresh(role)
    user.rol = role

    return serialize_user(user)


def update_user_service(db: Session, user_id: int, payload) -> dict:
    user = get_user_or_404(db, user_id)

    existing_user = get_user_by_email(db, payload.correo)
    if existing_user and existing_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese correo",
        )

    role = get_role_by_id(db, payload.rol_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rol no encontrado",
        )

    user.nombre = payload.nombre
    user.correo = payload.correo
    user.rol_id = payload.rol_id

    db.commit()
    db.refresh(user)
    db.refresh(role)
    user.rol = role

    return serialize_user(user)


def update_user_status_service(db: Session, user_id: int, payload) -> dict:
    user = get_user_or_404(db, user_id)

    user.activo = payload.activo

    db.commit()
    db.refresh(user)

    return serialize_user(user)