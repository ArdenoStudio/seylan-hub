import json
import logging
import uuid
from pathlib import Path

from fastapi import APIRouter

from app.models.schemas import (
    CategorizeRequest, CategorizeResponse,
    TaxJarRuleRequest, TaxJarRuleResponse,
)
from app.services.categorizer import categorize_transactions
from app.services import supabase_client

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["business"])

_FX = Path(__file__).parent.parent.parent / "fixtures"


@router.post("/categorize-transactions", response_model=CategorizeResponse)
async def categorize(req: CategorizeRequest):
    data = json.loads((_FX / "business_account.json").read_text(encoding="utf-8"))
    all_txns = data.get(req.user_id, {}).get("transactions", [])
    if req.transaction_ids:
        txns = [t for t in all_txns if t["id"] in req.transaction_ids]
    else:
        txns = all_txns
    log.info("categorize user=%s count=%d", req.user_id, len(txns))
    result = await categorize_transactions(txns)
    return CategorizeResponse(categorized=result)


@router.post("/tax-jar/rule", response_model=TaxJarRuleResponse)
async def tax_jar_rule(req: TaxJarRuleRequest):
    rule_id = f"TAX-RULE-{uuid.uuid4().hex[:6].upper()}"
    try:
        supabase_client.save_tax_jar_rule(
            user_id=req.user_id,
            from_account_id=req.from_account_id,
            to_account_id=req.to_account_id,
            percentage=req.percentage,
            label=req.label,
        )
    except Exception as exc:
        log.warning("Failed to save tax jar rule: %s", exc)

    log.info("tax_jar_rule user=%s pct=%s", req.user_id, req.percentage)
    pct = int(req.percentage)
    return TaxJarRuleResponse(
        rule_id=rule_id,
        status="ACTIVE",
        message=f"{pct}% of every incoming payment will be moved to your Tax Savings account.",
        message_si=f"සෑම ගෙවීමකින් {pct}%ක් ඔබේ බදු ඉතිරිකිරීමේ ගිණුමට ස්වයංක්‍රීයව යොමු වේ.",
    )