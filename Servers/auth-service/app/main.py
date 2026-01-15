from fastapi import FastAPI
from app.routes import auth
from app.db import Base, engine
from app.config import ENV

if ENV == "development":
    Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Auth Service",
    version="1.0.0",
    description="Authentication Service with JWT for Microservices"
)


app.include_router(auth.router)ś


@app.get("/", tags=["Health"])
def root():
    return {"message": "Auth Service is running"}
