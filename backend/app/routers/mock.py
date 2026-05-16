import json
import logging
import uuid
from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.schemas import TriggerSpendRequest, TaxJarTriggerRequest
from app.services import supabase_client

log = logging.getLogger(__name__)
router = APIRouter(prefix="/mock", tags=["mock"])

_FX = Path(__file__).parent.parent.parent / "fixtures"


def _load(name: str) -> dict:
    return json.loads((_FX / name).read_text(encoding="utf-8"))


@router.get("/account-context/{user_id}")
async def account_context(user_id: str):
    data = _load("account_context.json")
    if user_id not in data:
        return JSONResponse(status_code=404, content={"error": f"Unknown user {user_id}"})
    log.info("mock_call account-context user_id=%s", user_id)
    return data[user_id]


@router.get("/family-wallet/{account_id}")
async def family_wallet(account_id: str):
    data = _load("family_wallet.json")
    if account_id not in data:
        return JSONResponse(status_code=404, content={"error": f"Unknown account {account_id}"})
    log.info("mock_call family-wallet account_id=%s", account_id)
    return data[account_id]


@router.get("/loans/{user_id}")
async def loans(user_id: str):
    data = _load("loans.json")
    if user_id not in data:
        return JSONResponse(status_code=404, content={"error": f"Unknown user {user_id}"})
    log.info("mock_call loans user_id=%s", user_id)
    return data[user_id]


@router.get("/business-account/{user_id}")
async def business_account(user_id: str):
    data = _load("business_account.json")
    if user_id not in data:
        return JSONResponse(status_code=404, content={"error": f"Unknown user {user_id}"})
    log.info("mock_call business-account user_id=%s", user_id)
    return data[user_id]


@router.get("/pl-summary/{user_id}")
async def pl_summary(user_id: str):
    data = _load("pl_summary.json")
    if user_id not in data:
        return JSONResponse(status_code=404, content={"error": f"Unknown user {user_id}"})
    log.info("mock_call pl-summary user_id=%s", user_id)
    return data[user_id]


@router.post("/trigger-spend")
async def trigger_spend(req: TriggerSpendRequest):
    log.info("mock_call trigger-spend account=%s merchant=%s amount=%s",
             req.account_id, req.merchant, req.amount_lkr)
    try:
        row = supabase_client.insert_transaction(
            account_id=req.account_id,
            merchant=req.merchant,
            amount_lkr=req.amount_lkr,
            bucket_id=req.bucket_id,
            bucket_label=req.bucket_id.replace("_", " ").title(),
            source="mock",
        )
        txn_id = row.get("id", f"txn_demo_{uuid.uuid4().hex[:6]}")
    except Exception as exc:
        log.warning("Supabase insert failed: %s — returning mock response", exc)
        txn_id = f"txn_demo_{uuid.uuid4().hex[:6]}"

    return {
        "transaction_id": txn_id,
        "status": "POSTED",
        "bucket_id": req.bucket_id,
        "new_bucket_balance_lkr": 71500 - req.amount_lkr,
        "supabase_event_fired": True,
    }


@router.post("/tax-jar/trigger")
async def tax_jar_trigger(req: TaxJarTriggerRequest):
    log.info("mock_call tax-jar/trigger user=%s amount=%s", req.user_id, req.incoming_amount_lkr)
    tax_amount = round(req.incoming_amount_lkr * 0.10)
    base_balance = 15070
    new_balance = base_balance + tax_amount
    return {
        "transaction_id": f"biz_demo_tax_{uuid.uuid4().hex[:6]}",
        "incoming_amount_lkr": req.incoming_amount_lkr,
        "tax_transfer_amount_lkr": tax_amount,
        "to_account_id": "SEY-SAV-001",
        "new_tax_jar_balance_lkr": new_balance,
        "fund_transfer_id": f"FT-2026-{uuid.uuid4().hex[:5].upper()}",
        "status": "COMPLETED",
        "message_si": f"LKR {tax_amount:,} ක් ඔබේ බදු ඉතිරිකිරීමේ ගිණුමට ස්වයංක්‍රීයව මාරු කරන ලදී.",
    }


@router.post("/reset-demo")
async def reset_demo():
    cleared = 0
    try:
        cleared = supabase_client.clear_demo_transactions("SEY-ACC-002")
        supabase_client.reset_demo_state()
    except Exception as exc:
        log.warning("reset-demo supabase error: %s", exc)
    return {
        "status": "RESET_COMPLETE",
        "household_balance_lkr": 71500,
        "tax_jar_balance_lkr": 15070,
        "demo_transactions_cleared": cleared,
        "sessions_cleared": True,
    }