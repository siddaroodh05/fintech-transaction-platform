from fastapi import APIRouter, HTTPException, Request, Query
from app.config import ACCOUNT_SERVICE_URL
from pydantic import BaseModel, EmailStr, Field
import httpx

router = APIRouter(tags=["Accounts"])


class CreateAccountRequest(BaseModel):
    email: EmailStr
    holder_name: str
    account_number: str
    pin: str = Field(..., min_length=4, max_length=6)


@router.post("/create")
async def create_account(request: Request, account_data: CreateAccountRequest):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Missing access token in API Gateway")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ACCOUNT_SERVICE_URL}/accounts/create",
                json=account_data.model_dump(),
                cookies={"access_token": access_token},
                timeout=5.0
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            try:
                data = e.response.json()
                detail_msg = data.get("detail") if isinstance(data, dict) else str(data)
                if isinstance(detail_msg, dict):
                    detail_msg = detail_msg.get("detail", str(detail_msg))
            except Exception:
                detail_msg = e.response.text

            raise HTTPException(status_code=e.response.status_code, detail=detail_msg)

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Account Service is currently unreachable."
            )


@router.get("/me")
async def get_my_account(request: Request):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="User not authenticated")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{ACCOUNT_SERVICE_URL}/accounts/me",
                cookies={"access_token": access_token},
                timeout=5.0
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            try:
                data = e.response.json()
                detail_msg = data.get("detail") if isinstance(data, dict) else str(data)
                if isinstance(detail_msg, dict):
                    detail_msg = detail_msg.get("detail", str(detail_msg))
            except Exception:
                detail_msg = e.response.text

            raise HTTPException(status_code=e.response.status_code, detail=detail_msg)

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Account Service is currently unreachable."
            )


@router.post("/balance")
async def check_balance(
    request: Request,
    body: dict
):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    if "pin" not in body or not body["pin"]:
        raise HTTPException(status_code=400, detail="PIN is required in request body")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ACCOUNT_SERVICE_URL}/accounts/balance",
                json=body,                              
                cookies={"access_token": access_token}, 
                timeout=5.0
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            try:
                data = e.response.json()
                # Unwrap nested detail if present
                detail_msg = data.get("detail") if isinstance(data, dict) else str(data)
                if isinstance(detail_msg, dict):
                    detail_msg = detail_msg.get("detail", str(detail_msg))
            except Exception:
                detail_msg = e.response.text

            raise HTTPException(
                status_code=e.response.status_code,
                detail=detail_msg  
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Account Service is currently unreachable."
            )
            
            
@router.get("/verify")
async def verify_receiver_account(
    request: Request,
    account_number: str = Query(
        ...,
        min_length=12,
        max_length=12,
        regex="^[0-9]{12}$",
        description="12-digit receiver account number"
    )
):
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="User not authenticated")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{ACCOUNT_SERVICE_URL}/accounts/verify",
                params={"account_number": account_number},
                cookies={"access_token": access_token},
                timeout=5.0
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPStatusError as e:
            try:
                data = e.response.json()
                detail_msg = data.get("detail") if isinstance(data, dict) else str(data)
                if isinstance(detail_msg, dict):
                    detail_msg = detail_msg.get("detail", str(detail_msg))
            except Exception:
                detail_msg = e.response.text

            raise HTTPException(
                status_code=e.response.status_code,
                detail=detail_msg
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Account Service is currently unreachable."
            )
