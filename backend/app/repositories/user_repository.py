from sqlalchemy.orm import Session, joinedload

from app.models.user import User


def get_user_by_email(db: Session, correo: str) -> User | None:
    return (
        db.query(User)
        .options(joinedload(User.rol))
        .filter(User.correo == correo)
        .first()
    )


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return (
        db.query(User)
        .options(joinedload(User.rol))
        .filter(User.id == user_id)
        .first()
    )
    
def get_all_users(db: Session) -> list[User]:
    return db.query(User).options(joinedload(User.rol)).all()