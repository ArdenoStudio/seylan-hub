import logging
from typing import Any

import httpx

from app.config import settings

log = logging.getLogger(__name__)

_TIMEOUT = httpx.Timeout(15.0, connect=5.0)


def _base_url() -> str:
    return "https://" + settings.mpgs_host + "/api/rest/version/" + settings.mpgs_api_version


def _auth() -> tuple[str, str]:
    # If an operator ID is set, use operator-scoped credentials
    # MPGS format: merchant.{MID}.operator.{OPID}  or just  merchant.{MID}
    if settings.mpgs_operator_id:
        username = f"merchant.{settings.mpgs_merchant_id}.operator.{settings.mpgs_operator_id}"
    else:
        username = "merchant." + settings.mpgs_merchant_id
    return (username, settings.mpgs_api_password)


async def create_checkout_session(
    order_id: str,
    amount_lkr: float,
    description: str,
    return_url: str,
    purpose: str,
) -> dict[str, Any]:
    """Initiate a Hosted Checkout session (PUT /session)."""
    url = _base_url() + "/merchant/" + settings.mpgs_merchant_id + "/session"
    payload: dict[str, Any] = {
        "apiOperation": "INITIATE_CHECKOUT",
        "interaction": {
            "operation": "PURCHASE",
            "returnUrl": return_url,
            "displayControl": {"billingAddress": "HIDE"},
            "merchant": {"name": "Seylan Hub"},
        },
        "order": {
            "id": order_id,
            "amount": amount_lkr,
            "currency": "LKR",
            "description": description,
        },
    }

    log.info("MPGS create_checkout_session order_id=%s amount=%.2f", order_id, amount_lkr)

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.post(url, json=payload, auth=_auth())

    if not resp.is_success:
        log.error("MPGS session error %s: %s", resp.status_code, resp.text)
        raise RuntimeError(
            "MPGS session creation failed [" + str(resp.status_code) + "]: " + resp.text
        )

    data = resp.json()
    session_id: str = data.get("session", {}).get("id", "")
    success_indicator: str = data.get("successIndicator", "")
    checkout_url = (
        "https://" + settings.mpgs_host
        + "/checkout/version/" + settings.mpgs_api_version
        + "/checkout.html?session=" + session_id
    )

    log.info("MPGS session created session_id=%s", session_id)
    return {
        "session_id": session_id,
        "success_indicator": success_indicator,
        "order_id": order_id,
        "checkout_url": checkout_url,
    }


async def get_order_status(order_id: str) -> dict[str, Any]:
    """Query an order from MPGS (GET /order/{order_id})."""
    url = _base_url() + "/merchant/" + settings.mpgs_merchant_id + "/order/" + order_id

    log.info("MPGS get_order_status order_id=%s", order_id)

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.get(url, auth=_auth())

    if not resp.is_success:
        log.error("MPGS order status error %s: %s", resp.status_code, resp.text)
        raise RuntimeError(
            "MPGS order query failed [" + str(resp.status_code) + "]: " + resp.text
        )

    data = resp.json()
    return {
        "status": data.get("status", "UNKNOWN"),
        "amount": data.get("amount"),
        "currency": data.get("currency", "LKR"),
        "transactions": data.get("transaction", []),
        "last_updated_time": data.get("lastUpdatedTime", ""),
    }
