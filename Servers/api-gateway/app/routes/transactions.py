from fastapi import APIRouter, HTTPException, Request, Header, Query
import httpx

from app.config import TRANSACTION_SERVICE_URL

router = APIRouter(tags=["Transactions"])


@router.post("/transfer")
async def transfer_money(
    request: Request,
    body: dict,
    idempotency_key: str = Header(...)
):
    # Get access token from cookies
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Forward transfer request to Transaction Service
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{TRANSACTION_SERVICE_URL}/transactions/transfer",
                json=body,
                cookies={"access_token": access_token},
                headers={"Idempotency-Key": idempotency_key},  # preserve idempotency
                timeout=30.0  # allow DB locks or slow processing
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            # Extract structured error from Transaction Service
            try:
                error_data = e.response.json()
                detail_payload = error_data.get("detail", error_data)
            except Exception:
                detail_payload = e.response.text

            raise HTTPException(status_code=e.response.status_code, detail=detail_payload)

        except httpx.RequestError as e:
            # Log network errors
            print(f"Gateway RequestError: {str(e)}")
            raise HTTPException(status_code=502, detail="Transaction Service is currently unreachable.")


@router.get("/history")
async def get_history(
    request: Request,
    page: int = 1,
    limit: int = 50,
    since: str | None = Query(None),
    before: str | None = Query(None)
):
    # Check authentication
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Prepare query params for Transaction Service
    params = {"page": page, "limit": limit}
    if since:
        params["since"] = since
    if before:
        params["before"] = before

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{TRANSACTION_SERVICE_URL}/transactions/history",
                params=params,
                cookies={"access_token": access_token},
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            try:
                detail = e.response.json().get("detail", "Error fetching history")
            except Exception:
                detail = e.response.text
            raise HTTPException(status_code=e.response.status_code, detail=detail)

        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Transaction Service unreachable")


@router.get("/{tx_id}")
async def get_transaction_status(
    tx_id: str,
    request: Request
):
    # Get access token from cookies
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Forward request to Transaction Service
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{TRANSACTION_SERVICE_URL}/transactions/{tx_id}",
                cookies={"access_token": access_token},
                timeout=5.0
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            try:
                data = e.response.json()
                detail_msg = data.get("detail", str(data))
            except Exception:
                detail_msg = e.response.text

            raise HTTPException(status_code=e.response.status_code, detail=detail_msg)

        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Transaction Service is currently unreachable.")
