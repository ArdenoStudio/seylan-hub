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
        async with httpx.AsyncClient(verify=False, timeout=25.0) as c:
            resp = await c.get(url, headers=headers, params=params)
            ct = resp.headers.get("content-type", "")
            body = resp.json() if "json" in ct else resp.text[:500]
            return {
                "http_status": resp.status_code,
                "gateway": settings.seylan_gateway_default,
                "api_key_set": bool(settings.seylan_api_key),
                "body": body,
            }
    except httpx.TimeoutException as exc:
        return {"error_type": "TimeoutException", "error": repr(exc),
                "gateway": settings.seylan_gateway_default,
                "api_key_set": bool(settings.seylan_api_key)}
    except httpx.ConnectError as exc:
        return {"error_type": "ConnectError", "error": repr(exc),
                "gateway": settings.seylan_gateway_default}
    except Exception as exc:
        return {"error_type": type(exc).__name__, "error": repr(exc),
                "gateway": settings.seylan_gateway_default}