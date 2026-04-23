from sqlalchemy.orm import Session

from app.models.stock_alert import StockAlert
from app.repositories.stock_alert_repository import get_active_alerts, get_alert_by_product_id


def sync_stock_alert_for_product(db: Session, product) -> None:
    alert = get_alert_by_product_id(db, product.id)

    is_active = product.stock_actual <= product.stock_minimo

    if not alert:
        alert = StockAlert(
            producto_id=product.id,
            activa=is_active,
            stock_actual=product.stock_actual,
            stock_minimo=product.stock_minimo,
        )
        db.add(alert)
        return

    alert.activa = is_active
    alert.stock_actual = product.stock_actual
    alert.stock_minimo = product.stock_minimo


def list_active_alerts_service(db: Session, query: str | None = None) -> list[dict]:
    alerts = get_active_alerts(db, query=query)

    return [
        {
            "id": alert.id,
            "producto_id": alert.producto_id,
            "codigo_interno": alert.producto.codigo_interno,
            "nombre": alert.producto.nombre,
            "stock_actual": alert.stock_actual,
            "stock_minimo": alert.stock_minimo,
            "updated_at": alert.updated_at,
        }
        for alert in alerts
    ]