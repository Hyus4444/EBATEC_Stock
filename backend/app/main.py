from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.audit import router as audit_router
from app.routers.categories import router as categories_router
from app.routers.products import router as products_router
from app.routers.inventory_movements import router as inventory_movements_router
from app.routers.stock_alerts import router as stock_alerts_router

app = FastAPI(title="EBATEC Stock API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(audit_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(inventory_movements_router)
app.include_router(stock_alerts_router)

@app.get("/health")
def health():
    return {"status": "ok"}