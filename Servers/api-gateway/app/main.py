from fastapi import FastAPI
from app.routes import auth_routes
from app.middlewares.jwt_middleware import JWTMiddleware

app = FastAPI(title="API Gateway")

app.add_middleware(JWTMiddleware)


app.include_router(auth_routes.router, prefix="/auth")  

@app.get("/")
def root():
    return {"message": "API Gateway Running"}
