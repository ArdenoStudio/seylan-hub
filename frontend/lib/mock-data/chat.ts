import { MOCK_PL_SUMMARY, MOCK_BUSINESS_TRANSACTIONS } from "./business";
import { MOCK_WALLET } from "./wallet";

const MOCK_RESPONSES: Record<string, Record<string, string>> = {
  "SEY-USR-001": {
    "what is my savings balance": "Your savings bucket currently holds LKR 49,000. This is 20% of your last remittance of LKR 245,000 sent on 1 May 2026. No withdrawals have been made from savings this month.",
    "when is my next loan payment": "Your next loan payment of LKR 20,000 is due on 1 June 2026 — that's 16 days from now. You've made 24 of 36 payments so far (66% complete). You're on track!",
    "how much have i paid on my loan": "You've paid LKR 480,000 so far (24 monthly payments of LKR 20,000). Your outstanding balance is LKR 480,000 with 12 payments remaining. At this rate, you'll be debt-free by May 2027.",
    "what's my biggest expense this month": "Your biggest expense this month was LKR 15,000 for Royal College Term Fee on 14 May. In total, the School bucket has spent LKR 26,600 this period, and Household has spent LKR 26,500.",
  },
  "SEY-ACC-002": {
    "what is my savings balance": "Your savings balance is LKR 49,000. Nimal's allocation rules put 20% of each remittance into savings. No withdrawals have been made this month.",
    "when is my next loan payment": "You don't have an active loan on this account. Would you like me to check eligibility for a personal loan?",
    "how much have i paid on my loan": "There's no active loan linked to your account (SEY-ACC-002). If you'd like to explore loan options, I can help with that.",
    "what's my biggest expense this month": "Your biggest expense was LKR 15,000 at Royal College for term fees. Your household spending totals LKR 26,500 — the top merchant is Softlogic Glomark at LKR 6,800.",
  },
  "SEY-USR-003": {
    "what is my savings balance": "Your savings account holds LKR 23,400. I notice your loan health is marked AT_RISK — would you like advice on building an emergency buffer?",
    "when is my next loan payment": "Your next payment of LKR 45,000 is due on 20 May 2026 — that's in 4 days. Important: you missed your April payment. Catching up will help restore your health score.",
    "how much have i paid on my loan": "You've made 10 of 48 payments (LKR 450,000 total). Your outstanding balance is LKR 1,125,000. You missed payment #9 in April — making a double payment this month would help your standing.",
    "what's my biggest expense this month": "Your largest recent expense was LKR 45,000 for the May loan repayment. Beyond that, household expenses totalled LKR 18,200 this month.",
  },
};

const DEFAULT_RESPONSE = "Based on your account activity, everything looks normal. Is there something specific I can help you with? You can ask about balances, payments, spending patterns, or loan status.";

const EXPENSE_KEYWORDS = [
  "expense",
  "expenses",
  "spend",
  "spending",
  "spent",
  "cost",
  "costs",
  "debit",
  "debits",
  "outgoing",
  "outgoings",
];

const BIGGEST_EXPENSE_KEYWORDS = ["biggest", "largest", "highest", "top"];

function formatLkr(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function normalizeMessage(message: string): string {
  return message.toLowerCase().replace(/[?!.,]/g, "").trim();
}

function hasAnyKeyword(message: string, keywords: string[]): boolean {
  return keywords.some((keyword) => message.includes(keyword));
}

function getWalletExpenseSummary(includeOnlyBiggest: boolean): string {
  const debitTransactions = MOCK_WALLET.recent_transactions
    .filter((transaction) => transaction.type === "debit")
    .sort((a, b) => b.amount_lkr - a.amount_lkr);

  const totalSpent = MOCK_WALLET.buckets.reduce(
    (total, bucket) => total + bucket.spent_lkr,
    0
  );
  const bucketBreakdown = MOCK_WALLET.buckets
    .filter((bucket) => bucket.spent_lkr > 0)
    .map((bucket) => `${bucket.label}: ${formatLkr(bucket.spent_lkr)}`)
    .join(", ");
  const topTransactions = debitTransactions
    .slice(0, includeOnlyBiggest ? 1 : 3)
    .map((transaction) => `${transaction.merchant} (${formatLkr(transaction.amount_lkr)})`)
    .join("; ");

  if (includeOnlyBiggest) {
    return `Your biggest recent expense was ${topTransactions}. Total bucket spending this month is ${formatLkr(totalSpent)} (${bucketBreakdown}).`;
  }

  return `Your recent expenses total ${formatLkr(totalSpent)} across your wallet buckets. Breakdown: ${bucketBreakdown}. Top expenses: ${topTransactions}.`;
}

function getBusinessExpenseSummary(includeOnlyBiggest: boolean): string {
  const debitTransactions = MOCK_BUSINESS_TRANSACTIONS
    .filter((transaction) => transaction.type === "debit")
    .sort((a, b) => b.amount_lkr - a.amount_lkr);

  const topTransactions = debitTransactions
    .slice(0, includeOnlyBiggest ? 1 : 3)
    .map((transaction) => `${transaction.merchant} (${formatLkr(transaction.amount_lkr)})`)
    .join("; ");
  const categoryBreakdown = Object.entries(MOCK_PL_SUMMARY.expense_breakdown)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => `${category}: ${formatLkr(amount)}`)
    .join(", ");

  if (includeOnlyBiggest) {
    return `Your biggest business expense this week was ${topTransactions}. Total expenses for ${MOCK_PL_SUMMARY.week_label.toLowerCase()} are ${formatLkr(MOCK_PL_SUMMARY.expenses_lkr)}.`;
  }

  return `Your business expenses for ${MOCK_PL_SUMMARY.week_label.toLowerCase()} total ${formatLkr(MOCK_PL_SUMMARY.expenses_lkr)}. Breakdown: ${categoryBreakdown}. Top payments: ${topTransactions}.`;
}

function getExpenseResponse(userId: string, message: string): string {
  const includeOnlyBiggest = hasAnyKeyword(message, BIGGEST_EXPENSE_KEYWORDS);

  if (userId === "SEY-BIZ-001") {
    return getBusinessExpenseSummary(includeOnlyBiggest);
  }

  if (userId === "SEY-USR-003") {
    return MOCK_RESPONSES["SEY-USR-003"]["what's my biggest expense this month"];
  }

  return getWalletExpenseSummary(includeOnlyBiggest);
}

export function getMockChatResponse(userId: string, message: string): string {
  const userResponses = MOCK_RESPONSES[userId] ?? MOCK_RESPONSES["SEY-USR-001"];
  const lower = normalizeMessage(message);

  if (hasAnyKeyword(lower, EXPENSE_KEYWORDS)) {
    return getExpenseResponse(userId, lower);
  }

  for (const [key, response] of Object.entries(userResponses)) {
    if (lower.includes(key) || key.includes(lower)) {
      return response;
    }
  }

  return DEFAULT_RESPONSE;
}
