from fastapi import APIRouter, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import requests
from app.config import AUTH_SERVICE_URL

router = APIRouter()


@router.post("/signup")
def signup(user_data: dict):
    response = requests.post(f"{AUTH_SERVICE_URL}/auth/register", json=user_data)
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()



@router.post("/login")
def login(credentials: dict):
    response = requests.post(f"{AUTH_SERVICE_URL}/auth/login", json=credentials)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()


bearer_scheme = HTTPBearer()

@router.get("/me")
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    token = credentials.credentials
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{AUTH_SERVICE_URL}/auth/me", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()
