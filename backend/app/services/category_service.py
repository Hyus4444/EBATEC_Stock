from sqlalchemy.orm import Session

from app.repositories.category_repository import get_all_categories


def list_categories_service(db: Session) -> list[dict]:
    categories = get_all_categories(db)

    return [
        {
            "id": category.id,
            "nombre": category.nombre,
        }
        for category in categories
    ]