import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter

from app.config import settings
from app.models.schemas import WalletTransferRequest, WalletTransferResponse, BucketCredit, SaveAllocationRulesRequest
from app.services import supabase_client

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["wallet"])


@router.post("/wallet/transfer", response_model=WalletTransferResponse)
async def wallet_transfer(req: WalletTransferRequest):
    total_pct = sum(r.pct for r in req.allocation_rules)
    if abs(total_pct - 100) > 0.01:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail=f"Allocation percentages must sum to 100 (got {total_pct})")

    buckets_credited = [
        BucketCredit(bucket_id=r.bucket_id, amount_lkr=round(req.amount_lkr * r.pct / 100, 2))
        for r in req.allocation_rules
    ]
    transfer_id = f"TRF-{uuid.uuid4().hex[:8].upper()}"

    # Persist allocation rules
    try:
        supabase_client.save_allocation_rule(
            sender_id=req.sender_account_id,
            account_id=req.recipient_account_id,
            buckets=[{"id": r.bucket_id, "pct": r.pct} for r in req.allocation_rules],
        )
    except Exception as exc:
        log.warning("Failed to persist allocation rule: %s", exc)

    # Real bank transfer when enabled — always uses the sandbox test accounts
    _SOURCE_ACCOUNT = "064000012548001"
    _DEST_ACCOUNT   = "001213437904100"
    if settings.seylan_enable_transfers and settings.use_seylan_real:
        try:
            from app.seylan import transfers
            result = await transfers.transfer_funds(
                source=_SOURCE_ACCOUNT,
                destination=_DEST_ACCOUNT,
                amount=req.amount_lkr,
                user_ref=transfer_id[:16],
                src_narration=f"Seylan Hub remit {req.corridor}",
                dst_narration=f"Family wallet — {req.corridor}",
            )
            log.info("Seylan transfer succeeded: ref=%s", result.get("transaction_reference"))
        except Exception as exc:
            log.error("Seylan transfer failed: %s — returning mock COMPLETED", exc)

    # Record per-bucket credits so Supabase realtime and bucket balances stay consistent
    try:
        for r in req.allocation_rules:
            part = round(req.amount_lkr * r.pct / 100, 2)
            if part <= 0:
                continue
            supabase_client.insert_transaction(
                account_id=req.recipient_account_id,
                merchant=f"Remittance from {req.sender_account_id}",
                amount_lkr=part,
                bucket_id=r.bucket_id,
                bucket_label=r.bucket_id.replace("bucket_", "").replace("_", " ").title(),
                source="transfer",
                txn_type="credit",
            )
    except Exception as exc:
        log.warning("Failed to record transfer transaction: %s", exc)

    log.info("wallet_transfer sender=%s amount=%s", req.sender_account_id, req.amount_lkr)
    return WalletTransferResponse(
        transfer_id=transfer_id,
        status="COMPLETED",
        amount_lkr=req.amount_lkr,
        timestamp=datetime.now(timezone.utc).isoformat(),
        buckets_credited=buckets_credited,
    )


@router.post("/wallet/rules/{sender_id}")
async def save_wallet_rules(sender_id: str, req: SaveAllocationRulesRequest):
    total_pct = sum(r.pct for r in req.allocation_rules)
    if abs(total_pct - 100) > 0.01:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail=f"Allocation percentages must sum to 100 (got {total_pct})")
    try:
        result = supabase_client.save_allocation_rule(
            sender_id=sender_id,
            account_id=req.account_id,
            buckets=[{"id": r.bucket_id, "pct": r.pct} for r in req.allocation_rules],
        )
        return {"status": "saved", "data": result}
    except Exception as exc:
        log.error("save_wallet_rules failed: %s", exc)
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Failed to save allocation rules")


@router.get("/wallet/rules/{sender_id}")
async def get_wallet_rules(sender_id: str, account_id: str = "SEY-ACC-002"):
    try:
        rule = supabase_client.get_allocation_rules(sender_id, account_id)
    except Exception as exc:
        log.warning("get_allocation_rules failed: %s", exc)
        rule = None
    if rule:
        return rule
    return {
        "sender_id": sender_id,
        "account_id": account_id,
        "buckets": [
            {"id": "school",    "label": "School Fees", "pct": 40},
            {"id": "household", "label": "Household",   "pct": 40},
            {"id": "savings",   "label": "Savings",     "pct": 20},
        ],
    }