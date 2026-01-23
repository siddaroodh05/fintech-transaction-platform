from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyCookie 

from app.routes import auth
from app.db import Base, engine
from app.config import ENV


cookie_scheme = APIKeyCookie(name="access_token", auto_error=False)

if ENV == "development":
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Auth Service",
    version="1.0.0",
    description="Authentication Service with JWT using HTTP-only Cookies"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")

@app.get("/", tags=["Health"])
def root():
    return {"message": "Auth Service is running"}