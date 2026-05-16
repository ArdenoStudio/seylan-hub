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
                       source: str = "mock") -> dict:
    row = {
        "account_id": account_id,
        "merchant": merchant,
        "amount_lkr": amount_lkr,
        "bucket_id": bucket_id,
        "bucket_label": bucket_label,
        "source": source,
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


def clear_demo_transactions(account_id: str) -> int:
    result = (get_client().table("transactions")
              .delete().eq("account_id", account_id).eq("source", "mock").execute())
    return len(result.data) if result.data else 0


def reset_demo_state() -> None:
    (get_client().table("demo_state")
     .upsert({"id": 1, "scenario": "idle", "last_spend": None}).execute())