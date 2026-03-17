from sqlalchemy.orm import Session

from app.models.category import Category


def get_all_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.nombre.asc()).all()


def get_category_by_id(db: Session, category_id: int) -> Category | None:
    return db.query(Category).filter(Category.id == category_id).first()