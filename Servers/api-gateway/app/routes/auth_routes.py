from fastapi import APIRouter, HTTPException, Request, Response
from app.config import AUTH_SERVICE_URL
from pydantic import BaseModel
import httpx

router = APIRouter(tags=["Auth"])


@router.post("/register")
async def signup(user_data: dict, response: Response):
    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.post(
                f"{AUTH_SERVICE_URL}/auth/register",
                json=user_data,
                timeout=5.0
            )
            auth_response.raise_for_status()

            token = auth_response.cookies.get("access_token")
            if token:
                response.set_cookie(
                    key="access_token",
                    value=token,
                    httponly=True,
                    samesite="Lax",
                    path="/"
                )

            return auth_response.json()

        except httpx.HTTPStatusError as e:
            try:
                detail = e.response.json()
                if isinstance(detail, dict) and "detail" in detail:
                    detail = detail["detail"] 
            except Exception:
                detail = e.response.text
            raise HTTPException(
                status_code=e.response.status_code,
                detail=detail
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Auth Service is unreachable"
            )


@router.post("/login")
async def login(user_data: dict, response: Response):
    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.post(
                f"{AUTH_SERVICE_URL}/auth/login",
                json=user_data,
                timeout=5.0
            )
            auth_response.raise_for_status()

            token = auth_response.cookies.get("access_token")
            if token:
                response.set_cookie(
                    key="access_token",
                    value=token,
                    httponly=True,
                    samesite="Lax",
                    path="/"
                )

            return auth_response.json()

        except httpx.HTTPStatusError as e:
            try:
                detail = e.response.json()
                if isinstance(detail, dict) and "detail" in detail:
                    detail = detail["detail"]  # unwrap nested detail
            except Exception:
                detail = e.response.text
            raise HTTPException(
                status_code=e.response.status_code,
                detail=detail
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Auth Service is unreachable"
            )


@router.get("/me")
async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.get(
                f"{AUTH_SERVICE_URL}/auth/me",
                cookies={"access_token": token},
                timeout=5.0
            )
            auth_response.raise_for_status()
            return auth_response.json()

        except httpx.HTTPStatusError as e:
            try:
                detail = e.response.json()
                if isinstance(detail, dict) and "detail" in detail:
                    detail = detail["detail"]  # unwrap nested detail
            except Exception:
                detail = e.response.text
            raise HTTPException(
                status_code=e.response.status_code,
                detail=detail
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="Auth Service is unreachable"
            )


class MessageResponse(BaseModel):
    message: str


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logged out successfully"}
