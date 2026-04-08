from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories.category_repository import get_category_by_id
from app.repositories.product_repository import (
    get_paginated_products,
    get_product_by_code,
    get_product_by_id,
)
from app.services.audit_service import create_audit_log
from app.services.stock_alert_service import sync_stock_alert_for_product


def serialize_product(product: Product) -> dict:
    return {
        "id": product.id,
        "codigo_interno": product.codigo_interno,
        "nombre": product.nombre,
        "descripcion": product.descripcion,
        "categoria": product.categoria.nombre,
        "stock_actual": product.stock_actual,
        "stock_minimo": product.stock_minimo,
        "activo": product.activo,
    }


def list_products_service(
    db: Session,
    query: str | None = None,
    categoria_id: int | None = None,
) -> list[dict]:
    products = get_all_products(db, query=query, categoria_id=categoria_id)
    return [serialize_product(product) for product in products]

def list_products_paginated_service(
    db: Session,
    query: str | None = None,
    categoria_id: int | None = None,
    page: int = 1,
    page_size: int = 10,
) -> dict:
    total, products = get_paginated_products(
        db,
        query=query,
        categoria_id=categoria_id,
        page=page,
        page_size=page_size,
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [serialize_product(product) for product in products],
    }

def get_product_or_404(db: Session, product_id: int) -> Product:
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    return product


def create_product_service(db: Session, payload, current_user) -> dict:
    existing_product = get_product_by_code(db, payload.codigo_interno)
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un producto con ese código interno",
        )

    category = get_category_by_id(db, payload.categoria_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )

    product = Product(
        codigo_interno=payload.codigo_interno,
        nombre=payload.nombre,
        descripcion=payload.descripcion,
        categoria_id=payload.categoria_id,
        stock_actual=0,
        stock_minimo=payload.stock_minimo,
        activo=payload.activo,
    )

    db.add(product)
    db.flush()
    sync_stock_alert_for_product(db, product)

    create_audit_log(
        db=db,
        usuario_id=current_user.id,
        accion="CREAR",
        entidad="PRODUCTO",
        entidad_id=product.id,
        detalle=f"Se creó el producto {product.codigo_interno}",
    )
    
    db.commit()
    db.refresh(product)

    return get_product_detail_service(db, product.id)


def get_product_detail_service(db: Session, product_id: int) -> dict:
    product = get_product_or_404(db, product_id)
    return serialize_product(product)


def update_product_service(db: Session, product_id: int, payload, current_user) -> dict:
    product = get_product_or_404(db, product_id)

    existing_product = get_product_by_code(db, payload.codigo_interno)
    if existing_product and existing_product.id != product_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un producto con ese código interno",
        )

    category = get_category_by_id(db, payload.categoria_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )

    product.codigo_interno = payload.codigo_interno
    product.nombre = payload.nombre
    product.descripcion = payload.descripcion
    product.categoria_id = payload.categoria_id
    product.stock_minimo = payload.stock_minimo

    sync_stock_alert_for_product(db, product)
    db.flush()

    create_audit_log(
        db=db,
        usuario_id=current_user.id,
        accion="ACTUALIZAR",
        entidad="PRODUCTO",
        entidad_id=product.id,
        detalle=f"Se actualizó el producto {product.codigo_interno}",
    )

    db.commit()
    db.refresh(product)

    return get_product_detail_service(db, product.id)


def update_product_status_service(db: Session, product_id: int, payload, current_user) -> dict:
    product = get_product_or_404(db, product_id)

    product.activo = payload.activo

    db.flush()

    accion_estado = "ACTIVAR" if payload.activo else "DESACTIVAR"
    sync_stock_alert_for_product(db, product)
    
    create_audit_log(
        db=db,
        usuario_id=current_user.id,
        accion=accion_estado,
        entidad="PRODUCTO",
        entidad_id=product.id,
        detalle=f"Se cambió el estado del producto {product.codigo_interno} a {'activo' if payload.activo else 'inactivo'}",
    )

    db.commit()
    db.refresh(product)

    return get_product_detail_service(db, product.id)