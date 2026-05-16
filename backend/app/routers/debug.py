import logging
import httpx
from fastapi import APIRouter
from app.config import settings

log = logging.getLogger(__name__)
router = APIRouter(prefix="/debug", tags=["debug"])

TEST_ACCOUNT = "064000012548001"

@router.get("/seylan-ping")
async def seylan_ping():
    url = (f"{settings.seylan_gateway_default}"
           "/Inquiry/Account/AccountInquiry/1.0/GetAccountBalance")
    params = {"AccountCategory": "EXT", "AccountNumber": TEST_ACCOUNT}
    headers = {"x-api-key": settings.seylan_api_key, "Accept": "application/json"}
    try:
        async with httpx.AsyncClient(verify=False, timeout=12.0) as c:
            resp = await c.get(url, headers=headers, params=params)
            return {
                "http_status": resp.status_code,
                "gateway": settings.seylan_gateway_default,
                "api_key_set": bool(settings.seylan_api_key),
                "body": resp.json() if resp.headers.get("content-type","").startswith("application/json") else resp.text[:500],
            }
    except Exception as exc:
        return {"error": str(exc), "gateway": settings.seylan_gateway_default,
                "api_key_set": bool(settings.seylan_api_key)}