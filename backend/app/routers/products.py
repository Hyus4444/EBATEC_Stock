from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Query, status


from app.core.database import get_db
from app.dependencies.auth import require_admin, require_any_authenticated
from app.schemas.product import (
    ProductCreate,
    ProductPaginatedResponse,
    ProductResponse,
    ProductStatusUpdate,
    ProductUpdate,
)
from app.services.product_service import (
    create_product_service,
    get_product_detail_service,
    list_products_paginated_service,
    update_product_service,
    update_product_status_service,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductPaginatedResponse)
def list_products(
    query: str | None = Query(default=None),
    categoria_id: int | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user=Depends(require_any_authenticated),
):
    return list_products_paginated_service(
        db,
        query=query,
        categoria_id=categoria_id,
        page=page,
        page_size=page_size,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_any_authenticated),
):
    return get_product_detail_service(db, product_id)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return create_product_service(db, payload, current_user)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return update_product_service(db, product_id, payload, current_user)


@router.patch("/{product_id}/status", response_model=ProductResponse)
def update_product_status(
    product_id: int,
    payload: ProductStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return update_product_status_service(db, product_id, payload, current_user)