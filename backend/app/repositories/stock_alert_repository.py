from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.models.product import Product
from app.models.stock_alert import StockAlert


def get_alert_by_product_id(db: Session, product_id: int) -> StockAlert | None:
    return (
        db.query(StockAlert)
        .options(joinedload(StockAlert.producto))
        .filter(StockAlert.producto_id == product_id)
        .first()
    )


def get_active_alerts(db: Session, query: str | None = None) -> list[StockAlert]:
    q = (
        db.query(StockAlert)
        .join(Product, Product.id == StockAlert.producto_id)
        .options(joinedload(StockAlert.producto))
        .filter(StockAlert.activa.is_(True))
    )

    if query:
        normalized = f"%{query.strip()}%"
        q = q.filter(
            or_(
                Product.codigo_interno.ilike(normalized),
                Product.nombre.ilike(normalized),
            )
        )

    return q.order_by(StockAlert.updated_at.desc()).all()