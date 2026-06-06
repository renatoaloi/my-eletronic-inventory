from fastapi import Header, HTTPException
from typing import Optional
from app.config import API_KEY


async def verify_api_key(x_api_key: Optional[str] = Header(None)) -> str:
    if x_api_key is None or x_api_key != API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid or missing API Key",
        )
    return x_api_key
