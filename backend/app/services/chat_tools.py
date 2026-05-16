"""Tool definitions and executors for the AI chat assistant."""
import json
import logging
from pathlib import Path

log = logging.getLogger(__name__)

_FX = Path(__file__).parent.parent.parent / "fixtures"

TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "check_balance",
            "description": "Check the balance of a specific account (savings, current, or loan outstanding).",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID to check"},
                    "account_type": {
                        "type": "string",
                        "enum": ["savings", "current", "loan_outstanding"],
                        "description": "Which balance to check",
                    },
                },
                "required": ["user_id", "account_type"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "check_loan_status",
            "description": "Check the health status and details of a user's loan.",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID"},
                },
                "required": ["user_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_recent_transactions",
            "description": "Get the most recent transactions for a user account.",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user ID"},
                    "count": {"type": "integer", "description": "Number of transactions to return", "default": 5},
                },
                "required": ["user_id"],
            },
        },
    },
]


def execute_tool(name: str, arguments: dict) -> str:
    """Execute a tool call and return the result as a string."""
    try:
        if name == "check_balance":
            return _check_balance(arguments["user_id"], arguments["account_type"])
        elif name == "check_loan_status":
            return _check_loan_status(arguments["user_id"])
        elif name == "get_recent_transactions":
            return _get_recent_transactions(arguments["user_id"], arguments.get("count", 5))
        else:
            return json.dumps({"error": f"Unknown tool: {name}"})
    except Exception as exc:
        log.warning("Tool execution failed: %s(%s) — %s", name, arguments, exc)
        return json.dumps({"error": str(exc)})


def _check_balance(user_id: str, account_type: str) -> str:
    data = json.loads((_FX / "account_context.json").read_text(encoding="utf-8"))
    ctx = data.get(user_id, {})
    if account_type == "savings":
        return json.dumps({"account_type": "savings", "balance_lkr": ctx.get("savings_balance", 0), "user": ctx.get("name", user_id)})
    elif account_type == "current":
        return json.dumps({"account_type": "current", "balance_lkr": ctx.get("current_balance", 0), "user": ctx.get("name", user_id)})
    elif account_type == "loan_outstanding":
        loans = ctx.get("loans", [])
        if loans:
            return json.dumps({"account_type": "loan_outstanding", "outstanding_lkr": loans[0].get("outstanding_lkr", 0), "loan_type": loans[0].get("type", ""), "user": ctx.get("name", user_id)})
        return json.dumps({"account_type": "loan_outstanding", "outstanding_lkr": 0, "message": "No active loans"})
    return json.dumps({"error": f"Unknown account type: {account_type}"})


def _check_loan_status(user_id: str) -> str:
    from app.services.health_score import compute_health_score
    data = json.loads((_FX / "loans.json").read_text(encoding="utf-8"))
    entry = data.get(user_id, {})
    loans = entry.get("loans", [])
    if not loans:
        return json.dumps({"message": "No active loans found"})
    loan = loans[0]
    loan["health_score"] = compute_health_score(loan)
    return json.dumps({
        "loan_type": loan.get("type", ""),
        "purpose": loan.get("purpose", ""),
        "health_score": loan["health_score"],
        "outstanding_lkr": loan.get("outstanding_lkr", 0),
        "payments_made": loan.get("payments_made", 0),
        "total_payments": loan.get("total_payments", 0),
        "next_payment_date": loan.get("next_payment_date", ""),
        "monthly_payment_lkr": loan.get("monthly_payment_lkr", 0),
    })


def _get_recent_transactions(user_id: str, count: int = 5) -> str:
    data = json.loads((_FX / "account_context.json").read_text(encoding="utf-8"))
    ctx = data.get(user_id, {})
    txns = ctx.get("recent_transactions", [])[:count]
    return json.dumps({"transactions": txns, "count": len(txns)})
