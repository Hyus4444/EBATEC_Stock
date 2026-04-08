from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.product import Product


def get_products_query(
    db: Session,
    query: str | None = None,
    categoria_id: int | None = None,
):
    q = db.query(Product).options(joinedload(Product.categoria))

    if query:
        normalized = f"%{query.strip()}%"
        q = q.filter(
            or_(
                Product.codigo_interno.ilike(normalized),
                Product.nombre.ilike(normalized),
                Product.descripcion.ilike(normalized),
            )
        )

    if categoria_id:
        q = q.filter(Product.categoria_id == categoria_id)

    return q


def get_paginated_products(
    db: Session,
    query: str | None = None,
    categoria_id: int | None = None,
    page: int = 1,
    page_size: int = 10,
):
    q = get_products_query(db, query=query, categoria_id=categoria_id)

    total = q.count()

    items = (
        q.order_by(Product.nombre.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return total, items


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