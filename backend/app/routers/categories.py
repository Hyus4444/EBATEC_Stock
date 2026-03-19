from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_any_authenticated
from app.schemas.category import CategoryResponse
from app.services.category_service import list_categories_service

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryResponse])
def list_categories(
    db: Session = Depends(get_db),
    current_user=Depends(require_any_authenticated),
):
    return list_categories_service(db)