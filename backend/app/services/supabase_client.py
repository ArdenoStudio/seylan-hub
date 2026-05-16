import logging
from functools import lru_cache
from supabase import create_client, Client
from app.config import settings

log = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_client() -> Client:
    if not settings.supabase_url or not settings.supabase_service_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
    return create_client(settings.supabase_url, settings.supabase_service_key)


def insert_transaction(account_id: str, merchant: str, amount_lkr: float,
                       bucket_id: str | None = None, bucket_label: str | None = None,
                       source: str = "mock", txn_type: str = "debit") -> dict:
    from datetime import datetime, timezone
    row = {
        "account_id": account_id,
        "merchant": merchant,
        "amount_lkr": amount_lkr,
        "bucket_id": bucket_id,
        "bucket_label": bucket_label,
        "source": source,
        "type": txn_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    result = get_client().table("transactions").insert(row).execute()
    return result.data[0] if result.data else {}


def save_allocation_rule(sender_id: str, account_id: str, buckets: list[dict]) -> dict:
    row = {"sender_id": sender_id, "account_id": account_id, "buckets": buckets}
    result = (get_client().table("allocation_rules")
              .upsert(row, on_conflict="sender_id,account_id").execute())
    return result.data[0] if result.data else {}


def get_allocation_rules(sender_id: str, account_id: str) -> dict | None:
    result = (get_client().table("allocation_rules")
              .select("*")
              .eq("sender_id", sender_id)
              .eq("account_id", account_id)
              .limit(1).execute())
    return result.data[0] if result.data else None


def save_session(user_id: str, language: str, history: list[dict]) -> None:
    row = {"user_id": user_id, "language": language, "history": history}
    (get_client().table("sessions")
     .upsert(row, on_conflict="user_id").execute())


def save_tax_jar_rule(user_id: str, from_account_id: str, to_account_id: str,
                      percentage: float, label: str) -> dict:
    row = {
        "user_id": user_id,
        "from_account_id": from_account_id,
        "to_account_id": to_account_id,
        "percentage": percentage,
        "label": label,
        "status": "ACTIVE",
    }
    result = (get_client().table("tax_jar_rules")
              .upsert(row, on_conflict="user_id,from_account_id").execute())
    return result.data[0] if result.data else {}


def get_tax_jar_rule(user_id: str) -> dict | None:
    result = (get_client().table("tax_jar_rules")
              .select("*").eq("user_id", user_id).eq("status", "ACTIVE")
              .limit(1).execute())
    return result.data[0] if result.data else None


def get_recent_transactions(
    account_id: str,
    limit: int = 20,
    *,
    ascending: bool = False,
    source: str | None = None,
) -> list[dict]:
    """Return transactions for an account. Default is newest-first; use ascending=True to replay chronologically."""
    q = (
        get_client().table("transactions")
        .select("*")
        .eq("account_id", account_id)
        .order("timestamp", desc=not ascending)
        .order("id", desc=not ascending)
    )
    if source is not None:
        q = q.eq("source", source)
    result = q.limit(limit).execute()
    return result.data if result.data else []


def count_transactions(account_id: str, source: str | None = None) -> int:
    """Return the number of transaction rows for an account (optionally filtered by source)."""
    q = (
        get_client().table("transactions")
        .select("id", count="exact")
        .eq("account_id", account_id)
    )
    if source is not None:
        q = q.eq("source", source)
    result = q.execute()
    return result.count or 0


def batch_insert_transactions(rows: list[dict]) -> int:
    """Insert multiple transaction rows in one request. Returns number of rows inserted."""
    if not rows:
        return 0
    result = get_client().table("transactions").insert(rows).execute()
    return len(result.data) if result.data else 0


def clear_demo_transactions(account_id: str) -> int:
    result = (get_client().table("transactions")
              .delete().eq("account_id", account_id).eq("source", "mock").execute())
    return len(result.data) if result.data else 0


def reset_demo_state() -> None:
    (get_client().table("demo_state")
     .upsert({"id": 1, "scenario": "idle", "last_spend": None}).execute())


def reset_demo_full() -> dict:
    """Full demo reset: transactions, allocation rules, tax jar rule, sessions, demo_state."""
    c = get_client()
    # Clear all mock-sourced transactions for both demo accounts
    txn_result = c.table("transactions").delete().in_("source", ["mock", "transfer"]).execute()
    cleared = len(txn_result.data) if txn_result.data else 0

    # Reset allocation rules for the diaspora wallet
    c.table("allocation_rules").upsert({
        "sender_id": "SEY-USR-001",
        "account_id": "SEY-ACC-002",
        "buckets": [
            {"id": "school",    "label": "School Fees", "pct": 40},
            {"id": "household", "label": "Household",   "pct": 40},
            {"id": "savings",   "label": "Savings",     "pct": 20},
        ],
    }, on_conflict="sender_id,account_id").execute()

    # Reset / ensure tax jar rule is active at 10%
    c.table("tax_jar_rules").upsert({
        "user_id": "SEY-BIZ-001",
        "from_account_id": "SEY-BIZ-001",
        "to_account_id": "SEY-SAV-001",
        "percentage": 10,
        "label": "Tax Savings",
        "status": "ACTIVE",
    }, on_conflict="user_id,from_account_id").execute()

    # Clear chat sessions
    c.table("sessions").delete().in_("user_id",
        ["SEY-USR-001", "SEY-USR-003", "SEY-BIZ-001"]).execute()

    # Reset demo_state
    c.table("demo_state").upsert(
        {"id": 1, "scenario": "idle", "last_spend": None}).execute()

    return {"transactions_cleared": cleared, "buckets": "reset", "tax_jar": "reset",
            "sessions": "cleared"}


def ping() -> bool:
    """Quick connectivity check — SELECT 1 equivalent."""
    result = get_client().table("transactions").select("id").limit(1).execute()
    return result is not None

# --- Payments (MPGS) ---

def save_payment(payment: dict) -> dict:
    from datetime import datetime, timezone
    payment.setdefault("created_at", datetime.now(timezone.utc).isoformat())
    payment.setdefault("updated_at", datetime.now(timezone.utc).isoformat())
    result = get_client().table("payments").insert(payment).execute()
    return result.data[0] if result.data else {}


def update_payment_status(order_id: str, status: str, gateway_response: dict) -> dict:
    from datetime import datetime, timezone
    result = (
        get_client()
        .table("payments")
        .update({
            "status": status,
            "gateway_response": gateway_response,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })
        .eq("order_id", order_id)
        .execute()
    )
    return result.data[0] if result.data else {}


def get_payment(order_id: str) -> dict | None:
    result = (
        get_client()
        .table("payments")
        .select("*")
        .eq("order_id", order_id)
        .limit(1)
        .execute()
    )
    return result.data[0] if result.data else None