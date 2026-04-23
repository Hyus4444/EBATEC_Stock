import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.inventory_movement_repository import create_inventory_movement
from app.repositories.product_repository import get_product_by_id
from app.services.audit_service import create_audit_log
from app.services.stock_alert_service import sync_stock_alert_for_product


ENTRY_ALLOWED_REASONS = {"COMPRA", "REINTEGRO"}
EXIT_ALLOWED_REASONS = {"DESPACHO", "CONSUMO"}


def _get_active_product_or_404(db: Session, producto_id: int):
    product = get_product_by_id(db, producto_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {producto_id} no encontrado",
        )

    if not product.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El producto {product.codigo_interno} está inactivo",
        )

    return product


def register_entry_service(db: Session, payload, current_user) -> dict:
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debes enviar al menos un ítem para la entrada",
        )

    id_operacion = str(uuid.uuid4())

    for item in payload.items:
        if item.motivo not in ENTRY_ALLOWED_REASONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Motivo de entrada inválido: {item.motivo}",
            )

        product = _get_active_product_or_404(db, item.producto_id)
        product.stock_actual += item.cantidad
        product = _get_active_product_or_404(db, item.producto_id)
        _validate_reason_by_category(product, item.motivo, "ENTRADA")
        sync_stock_alert_for_product(db, product)

        create_inventory_movement(
            db=db,
            id_operacion=id_operacion,
            producto_id=product.id,
            usuario_id=current_user.id,
            tipo_movimiento="ENTRADA",
            motivo=item.motivo,
            cantidad=item.cantidad,
            observacion=payload.observacion,
        )

        create_audit_log(
            db=db,
            usuario_id=current_user.id,
            accion="ENTRADA",
            entidad="PRODUCTO",
            entidad_id=product.id,
            detalle=f"Entrada de {item.cantidad} unidades al producto {product.codigo_interno}. Operación {id_operacion}",
        )

    db.commit()

    return {
        "message": "Entrada registrada correctamente",
        "id_operacion": id_operacion,
    }


def register_exit_service(db: Session, payload, current_user) -> dict:
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debes enviar al menos un ítem para la salida",
        )

    validated_items = []

    for item in payload.items:
        if item.motivo not in EXIT_ALLOWED_REASONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Motivo de salida inválido: {item.motivo}",
            )

        product = _get_active_product_or_404(db, item.producto_id)

        if item.cantidad > product.stock_actual:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuficiente para el producto {product.codigo_interno}",
            )

        validated_items.append((item, product))

    id_operacion = str(uuid.uuid4())

    for item, product in validated_items:
        product.stock_actual -= item.cantidad
        
        sync_stock_alert_for_product(db, product)
        product = _get_active_product_or_404(db, item.producto_id)
        _validate_reason_by_category(product, item.motivo, "SALIDA")

        create_inventory_movement(
            db=db,
            id_operacion=id_operacion,
            producto_id=product.id,
            usuario_id=current_user.id,
            tipo_movimiento="SALIDA",
            motivo=item.motivo,
            cantidad=item.cantidad,
            observacion=payload.observacion,
        )

        create_audit_log(
            db=db,
            usuario_id=current_user.id,
            accion="SALIDA",
            entidad="PRODUCTO",
            entidad_id=product.id,
            detalle=f"Salida de {item.cantidad} unidades del producto {product.codigo_interno}. Operación {id_operacion}",
        )

    db.commit()

    return {
        "message": "Salida registrada correctamente",
        "id_operacion": id_operacion,
    }


def adjust_inventory_service(db: Session, payload, current_user) -> dict:
    product = _get_active_product_or_404(db, payload.producto_id)

    if payload.tipo_ajuste not in {"INCREMENTO", "DECREMENTO"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="tipo_ajuste debe ser Incremento o Decremento",
        )

    if payload.tipo_ajuste == "DECREMENTO" and payload.cantidad > product.stock_actual:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El ajuste no puede dejar stock negativo para el producto {product.codigo_interno}",
        )

    id_operacion = str(uuid.uuid4())

    if payload.tipo_ajuste == "INCREMENTO":
        product.stock_actual += payload.cantidad
        movement_type = "AJUSTE_INCREMENTO"
    else:
        product.stock_actual -= payload.cantidad
        movement_type = "AJUSTE_DECREMENTO"
        
    sync_stock_alert_for_product(db, product)
    
    create_inventory_movement(
        db=db,
        id_operacion=id_operacion,
        producto_id=product.id,
        usuario_id=current_user.id,
        tipo_movimiento="AJUSTE",
        motivo=payload.tipo_ajuste,
        cantidad=payload.cantidad,
        observacion=payload.observacion,
    )

    create_audit_log(
        db=db,
        usuario_id=current_user.id,
        accion=movement_type,
        entidad="PRODUCTO",
        entidad_id=product.id,
        detalle=f"Ajuste {payload.tipo_ajuste} de {payload.cantidad} unidades al producto {product.codigo_interno}. Justificación: {payload.justificacion}. Operación {id_operacion}",
    )

    db.commit()

    return {
        "message": "Ajuste registrado correctamente",
        "id_operacion": id_operacion,
    }
    
def _validate_reason_by_category(product, reason: str, movement_type: str) -> None:
    category_name = product.categoria.nombre

    if reason == "CONSUMO" and category_name != "MATERIA_PRIMA":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El motivo Consumo solo aplica a productos de categoría Materia Prima. Producto: {product.codigo_interno}",
        )

    if reason == "REINTEGRO" and category_name != "MATERIA_PRIMA":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El motivo Reintegro solo aplica a productos de categoría Materia Prima. Producto: {product.codigo_interno}",
        )
    if reason == "DESPACHO" and category_name != "ACCESORIO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El motivo Despacho solo aplica a productos tipo Accesorio. Producto: {product.codigo_interno}",
        )