from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_admin, require_admin_or_operario
from app.schemas.inventory_movement import AdjustInventoryRequest, MovementRequest
from app.services.inventory_movement_service import (
    adjust_inventory_service,
    register_entry_service,
    register_exit_service,
)

router = APIRouter(tags=["Inventory Movements"])


@router.post("/movements/entry")
def register_entry(
    payload: MovementRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_operario),
):
    return register_entry_service(db, payload, current_user)


@router.post("/movements/exit")
def register_exit(
    payload: MovementRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_operario),
):
    return register_exit_service(db, payload, current_user)


@router.post("/inventory/adjust")
def adjust_inventory(
    payload: AdjustInventoryRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return adjust_inventory_service(db, payload, current_user)