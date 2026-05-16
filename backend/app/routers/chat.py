import asyncio
import json
import logging

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.config import settings
from app.models.schemas import ChatRequest
from app.services import groq_client, supabase_client
from app.services.context_builder import build_assistant_system_prompt

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["chat"])

# In-process account context cache (avoids re-reading fixtures per token)
_ctx_cache: dict[str, dict] = {}


def _get_account_context(user_id: str) -> dict:
    if user_id in _ctx_cache:
        return _ctx_cache[user_id]
    import json
    from pathlib import Path
    fx = Path(__file__).parent.parent.parent / "fixtures" / "account_context.json"
    data = json.loads(fx.read_text(encoding="utf-8"))
    ctx = data.get(user_id, {"user_id": user_id, "name": "Customer",
                              "savings_balance": 0, "current_balance": 0,
                              "recent_transactions": [], "loans": [], "fixed_deposits": []})
    _ctx_cache[user_id] = ctx
    return ctx


@router.post("/chat")
async def chat(req: ChatRequest):
    account_ctx = _get_account_context(req.user_id)
    if settings.use_seylan_real:
        try:
            from app.seylan import account as seylan_acct
            acct_nums = account_ctx.get("accounts", [])
            if acct_nums:
                bal = await seylan_acct.get_balance(acct_nums[0])
                account_ctx = {**account_ctx,
                               "savings_balance": bal.get("balance_lkr", account_ctx.get("savings_balance"))}
        except Exception as exc:
            log.warning("Seylan balance fetch for context failed: %s", exc)

    system_prompt = build_assistant_system_prompt(account_ctx, req.language)
    messages = [{"role": m.role, "content": m.content} for m in req.history]
    messages.append({"role": "user", "content": req.message})

    async def event_stream():
        full_response = []
        try:
            async for token in groq_client.stream_chat(system_prompt, messages):
                full_response.append(token)
                payload = json.dumps({"token": token}, ensure_ascii=False)
                yield f"data: {payload}\n\n"
            yield 'data: {"done": true}\n\n'
        except Exception as exc:
            log.error("Groq streaming error: %s", exc)
            yield f'data: {{"error": "{str(exc)}", "done": true}}\n\n'
        finally:
            # Fire-and-forget session save
            try:
                updated = [{"role": m.role, "content": m.content} for m in req.history]
                updated.append({"role": "user", "content": req.message})
                updated.append({"role": "assistant", "content": "".join(full_response)})
                supabase_client.save_session(req.user_id, req.language, updated)
            except Exception:
                pass

    return StreamingResponse(event_stream(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})