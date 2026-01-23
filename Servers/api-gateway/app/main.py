from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.account_routes import router as account_router
from app.middlewares.jwt_middleware import JWTMiddleware

app = FastAPI(title="API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(JWTMiddleware)

app.include_router(auth_router, prefix="/auth")
app.include_router(account_router, prefix="/accounts")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "api-gateway"
    }
