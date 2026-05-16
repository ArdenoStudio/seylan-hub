from datetime import date


def build_assistant_system_prompt(account_context: dict, language: str = "en") -> str:
    name = account_context.get("name") or account_context.get("account_holder", "Customer")
    savings = account_context.get("savings_balance", 0)
    current = account_context.get("current_balance", 0)
    today = date.today().isoformat()

    txns = account_context.get("recent_transactions", [])
    txn_lines = "\n".join(
        f"  - {t.get('date') or t.get('timestamp','')[:10]}: "
        f"{t.get('description','Transaction')} — "
        f"LKR {abs(t.get('amount_lkr', 0)):,.0f} "
        f"({'debit' if t.get('type') == 'debit' or t.get('amount_lkr', 0) < 0 else 'credit'})"
        for t in txns[:5]
    )

    loans = account_context.get("loans", [])
    loan_lines = "\n".join(
        f"  - {l.get('type','Loan')}: "
        f"LKR {l.get('outstanding_lkr', l.get('outstanding_amount_lkr', 0)):,.0f} outstanding, "
        f"LKR {l.get('monthly_installment_lkr', l.get('monthly_payment_lkr', 0)):,.0f}/month, "
        f"next payment {l.get('next_payment_date','unknown')}"
        for l in loans
    ) or "  None"

    fds = account_context.get("fixed_deposits", [])
    fd_lines = "\n".join(
        f"  - LKR {f.get('amount_lkr', f.get('principal_lkr', 0)):,.0f} "
        f"at {f.get('interest_rate_pct', 0)}% p.a., "
        f"matures {f.get('maturity_date','unknown')}"
        for f in fds
    ) or "  None"

    lang_instruction = (
        "Always respond in English. Be clear and concise."
        if language == "en"
        else "Always respond in Sinhala (Sinhala script). If the user writes in English, still respond in Sinhala."
    )

    return f"""You are Seylan AI, a personal banking assistant for Seylan Bank Sri Lanka. You have access to the customer's live account data shown below.

{lang_instruction}

Be helpful, warm, and concise. Maximum 3 sentences per response unless the customer asks for detail. Never make up information that is not in the account context. Never reveal internal account IDs, NIC numbers, or system fields. If asked something outside your account context, answer briefly and honestly.

CUSTOMER ACCOUNT CONTEXT:
Name: {name}
Savings account balance: LKR {savings:,.0f}
Current account balance: LKR {current:,.0f}

Recent transactions (last 5):
{txn_lines if txn_lines else "  No recent transactions"}

Active loans:
{loan_lines}

Fixed deposits:
{fd_lines}

Today's date is {today}. Use this when the customer asks about dates relative to today."""


def build_loan_advisor_prompt(loan: dict) -> str:
    paid = loan.get("payments_made", 0)
    total = loan.get("total_payments", 36)
    pct = round(paid / total * 100) if total else 0
    remaining = total - paid

    return f"""You are a loan advisor for Seylan Bank Sri Lanka. Give a brief, encouraging, and accurate 2-3 sentence summary of the customer's loan health. Be specific with numbers. Mention the payoff date. If they are on track, say so positively. If they could save money by paying extra, mention the exact saving. Do not use bullet points. Write in plain conversational English.

LOAN DATA:
Loan type: {loan.get('type', 'Loan')}
Original amount: LKR {loan.get('disbursed_lkr', 0):,.0f}
Outstanding: LKR {loan.get('outstanding_lkr', 0):,.0f}
Payments made: {paid} of {total}
Percent paid: {pct}%
Months remaining: {remaining}
Monthly instalment: LKR {loan.get('monthly_payment_lkr', 0):,.0f}
Missed payments: {loan.get('missed_payments', 0)}
Health score: {loan.get('health_score', 'UNKNOWN')}
Projected payoff date: {loan.get('projected_payoff_date', 'unknown')}"""


CATEGORIZER_SYSTEM = """You are a financial transaction categorizer for Sri Lankan small businesses. Categorize each transaction into exactly one of these categories: INCOME, SUPPLIER, UTILITIES, WAGES, RENT, TRANSPORT, MISC. Also provide the Sinhala translation.

CATEGORIES:
- INCOME (ආදායම): Any credit - cash sales, QR payments, customer payments, refunds
- SUPPLIER (සැපයුම්කරු): Payments to named suppliers - paint, cement, tiles, hardware stock
- UTILITIES (උපයෝගිතා): CEB, water board, SLT/Dialog, broadband bills
- WAGES (වැටුප්): Staff wages, advances, bonuses - any payment to an employee
- RENT (කුලිය): Shop rent, warehouse rent, premises lease
- TRANSPORT (ප්‍රවාහන): PickMe, three-wheeler, lorry hire, fuel, delivery charges
- MISC (විවිධ): Stationery, refreshments, anything that doesn't fit above

Return ONLY a valid JSON array. No markdown, no explanation. Each object must have: id, category_en, category_si, subcategory, confidence (0.0-1.0)."""