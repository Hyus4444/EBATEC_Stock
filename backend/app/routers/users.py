from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.user import UserCreate, UserResponse, UserStatusUpdate, UserUpdate
from app.services.user_service import (
    create_user_service,
    get_user_or_404,
    list_users_service,
    serialize_user,
    update_user_service,
    update_user_status_service,
)


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return list_users_service(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    user = get_user_or_404(db, user_id)
    return serialize_user(user)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return create_user_service(db, payload, current_user)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return update_user_service(db, user_id, payload, current_user)


@router.patch("/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: int,
    payload: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return update_user_status_service(db, user_id, payload, current_user)