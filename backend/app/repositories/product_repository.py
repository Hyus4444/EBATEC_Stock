from sqlalchemy.orm import Session, joinedload

from app.models.product import Product


def get_all_products(db: Session) -> list[Product]:
    return db.query(Product).options(joinedload(Product.categoria)).all()


def get_product_by_id(db: Session, product_id: int) -> Product | None:
    return (
        db.query(Product)
        .options(joinedload(Product.categoria))
        .filter(Product.id == product_id)
        .first()
    )


def get_product_by_code(db: Session, codigo_interno: str) -> Product | None:
    return (
        db.query(Product)
        .options(joinedload(Product.categoria))
        .filter(Product.codigo_interno == codigo_interno)
        .first()
    )