from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.role import Role
from app.models.user import User


ADMIN_EMAIL = "admin@ebatec.com"
ADMIN_PASSWORD = "EbatecAdmin2026*"
ADMIN_NAME = "Administrador"


def seed_roles(db: Session) -> None:
    roles = ["ADMINISTRADOR", "OPERARIO", "CONSULTA"]

    for role_name in roles:
        existing_role = db.query(Role).filter(Role.nombre == role_name).first()
        if not existing_role:
            db.add(Role(nombre=role_name))

    db.commit()


def seed_admin_user(db: Session) -> None:
    existing_admin = db.query(User).filter(User.correo == ADMIN_EMAIL).first()
    if existing_admin:
        return

    admin_role = db.query(Role).filter(Role.nombre == "ADMINISTRADOR").first()
    if not admin_role:
        raise ValueError("El rol ADMINISTRADOR no existe. Ejecuta primero el seed de roles.")

    admin_user = User(
        nombre=ADMIN_NAME,
        correo=ADMIN_EMAIL,
        password_hash=hash_password(ADMIN_PASSWORD),
        activo=True,
        rol_id=admin_role.id,
    )

    db.add(admin_user)
    db.commit()


def run_seed() -> None:
    db = SessionLocal()
    try:
        seed_roles(db)
        seed_admin_user(db)
        print("Seed completado correctamente.")
        print(f"Admin: {ADMIN_EMAIL}")
        print(f"Password: {ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()