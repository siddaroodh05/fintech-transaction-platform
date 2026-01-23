from fastapi import Request, HTTPException
from app.utils.jwt_handler import decode_access_token

def get_current_user_id(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing access token")

    payload = decode_access_token(token)
    if not payload.sub:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload.sub
