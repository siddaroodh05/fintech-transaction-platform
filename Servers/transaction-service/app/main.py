from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import account_routes
from app.db import Base, engine

app = FastAPI(
    title="Transaction Service",
    description="Handles accounts, PIN, and account profile for financial platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

app.include_router(account_routes.router, prefix="/accounts")

@app.get("/", summary="Service health check")
def root():
    return {"status": "Transaction Service is running"}
