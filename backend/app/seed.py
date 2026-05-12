from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password

from app.models.role import Role
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.stock_alert import StockAlert


ADMIN_EMAIL = "admin@ebatec.com"
ADMIN_PASSWORD = "EbatecAdmin2026*"
ADMIN_NAME = "Administrador Demo"

OPERARIO_EMAIL = "operario@ebatec.com"
OPERARIO_PASSWORD = "Operario2026*"
OPERARIO_NAME = "Operario Demo"

CONSULTA_EMAIL = "consulta@ebatec.com"
CONSULTA_PASSWORD = "Consulta2026*"
CONSULTA_NAME = "Consulta Demo"


def seed_categories(db: Session) -> None:
    categories = ["MATERIA_PRIMA", "ACCESORIO"]

    for category_name in categories:
        existing_category = (
            db.query(Category).filter(Category.nombre == category_name).first()
        )
        if not existing_category:
            db.add(Category(nombre=category_name))

    db.commit()


def seed_roles(db: Session) -> None:
    roles = ["ADMINISTRADOR", "OPERARIO", "CONSULTA"]

    for role_name in roles:
        existing_role = db.query(Role).filter(Role.nombre == role_name).first()
        if not existing_role:
            db.add(Role(nombre=role_name))

    db.commit()


def seed_users(db: Session) -> None:
    admin_role = db.query(Role).filter(Role.nombre == "ADMINISTRADOR").first()
    operario_role = db.query(Role).filter(Role.nombre == "OPERARIO").first()
    consulta_role = db.query(Role).filter(Role.nombre == "CONSULTA").first()

    if not admin_role or not operario_role or not consulta_role:
        raise ValueError("Faltan roles. Ejecuta primero el seed de roles.")

    users = [
        {
            "nombre": ADMIN_NAME,
            "correo": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
            "rol_id": admin_role.id,
            "activo": True,
        },
        {
            "nombre": OPERARIO_NAME,
            "correo": OPERARIO_EMAIL,
            "password": OPERARIO_PASSWORD,
            "rol_id": operario_role.id,
            "activo": True,
        },
        {
            "nombre": CONSULTA_NAME,
            "correo": CONSULTA_EMAIL,
            "password": CONSULTA_PASSWORD,
            "rol_id": consulta_role.id,
            "activo": True,
        },
    ]

    for user_data in users:
        existing_user = db.query(User).filter(User.correo == user_data["correo"]).first()
        if not existing_user:
            db.add(
                User(
                    nombre=user_data["nombre"],
                    correo=user_data["correo"],
                    password_hash=hash_password(user_data["password"]),
                    activo=user_data["activo"],
                    rol_id=user_data["rol_id"],
                )
            )

    db.commit()


def seed_products(db: Session) -> None:
    materia_prima = db.query(Category).filter(Category.nombre == "MATERIA_PRIMA").first()
    accesorio = db.query(Category).filter(Category.nombre == "ACCESORIO").first()

    if not materia_prima or not accesorio:
        raise ValueError("Faltan categorías. Ejecuta primero el seed de categorías.")

    products = [
        {
            "codigo_interno": "MAT-001",
            "nombre": "Cable de cobre",
            "descripcion": "Materia prima para fabricación",
            "categoria_id": materia_prima.id,
            "stock_actual": 12,
            "stock_minimo": 10,
            "activo": True,
        },
        {
            "codigo_interno": "MAT-002",
            "nombre": "Resina epóxica",
            "descripcion": "Materia prima de ensamble",
            "categoria_id": materia_prima.id,
            "stock_actual": 4,
            "stock_minimo": 8,
            "activo": True,
        },
        {
            "codigo_interno": "ACC-001",
            "nombre": "Auricular EBATEC",
            "descripcion": "Producto final",
            "categoria_id": accesorio.id,
            "stock_actual": 25,
            "stock_minimo": 5,
            "activo": True,
        },
        {
            "codigo_interno": "ACC-002",
            "nombre": "Control inalámbrico",
            "descripcion": "Accesorio final",
            "categoria_id": accesorio.id,
            "stock_actual": 2,
            "stock_minimo": 6,
            "activo": True,
        },
    ]

    for product_data in products:
        existing_product = (
            db.query(Product)
            .filter(Product.codigo_interno == product_data["codigo_interno"])
            .first()
        )

        if not existing_product:
            db.add(Product(**product_data))

    db.commit()


def seed_alerts(db: Session) -> None:
    products = db.query(Product).all()

    for product in products:
        existing_alert = (
            db.query(StockAlert)
            .filter(StockAlert.producto_id == product.id)
            .first()
        )

        should_be_active = product.stock_actual <= product.stock_minimo

        if existing_alert:
            existing_alert.stock_actual = product.stock_actual
            existing_alert.stock_minimo = product.stock_minimo
            existing_alert.activa = should_be_active
        else:
            db.add(
                StockAlert(
                    producto_id=product.id,
                    stock_actual=product.stock_actual,
                    stock_minimo=product.stock_minimo,
                    activa=should_be_active,
                )
            )

    db.commit()


def run_seed() -> None:
    db = SessionLocal()
    try:
        seed_roles(db)
        seed_categories(db)
        seed_users(db)
        seed_products(db)
        seed_alerts(db)

        print("Seed completado correctamente.")
        print(f"Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
        print(f"Operario: {OPERARIO_EMAIL} / {OPERARIO_PASSWORD}")
        print(f"Consulta: {CONSULTA_EMAIL} / {CONSULTA_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()