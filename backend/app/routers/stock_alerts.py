from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.stock_alert import StockAlertResponse
from app.services.stock_alert_service import list_active_alerts_service

router = APIRouter(prefix="/alerts-stock", tags=["Stock Alerts"])


@router.get("", response_model=list[StockAlertResponse])
def list_stock_alerts(
    query: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return list_active_alerts_service(db, query=query)