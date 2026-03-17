from sqlalchemy.orm import Session

from app.models.inventory_movement import InventoryMovement


def create_inventory_movement(
    db: Session,
    *,
    id_operacion: str,
    producto_id: int,
    usuario_id: int,
    tipo_movimiento: str,
    motivo: str,
    cantidad: int,
    observacion: str | None = None,
) -> InventoryMovement:
    movement = InventoryMovement(
        id_operacion=id_operacion,
        producto_id=producto_id,
        usuario_id=usuario_id,
        tipo_movimiento=tipo_movimiento,
        motivo=motivo,
        cantidad=cantidad,
        observacion=observacion,
    )
    db.add(movement)
    return movement