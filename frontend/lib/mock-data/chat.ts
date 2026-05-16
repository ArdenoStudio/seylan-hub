import { Loan, Transaction } from "@/types";
import { MOCK_PL_SUMMARY, MOCK_BUSINESS_TRANSACTIONS } from "./business";
import { MOCK_LOAN_NIMAL, MOCK_LOAN_SUNIL } from "./loans";
import { MOCK_WALLET } from "./wallet";

const TODAY = new Date("2026-05-16T00:00:00Z");
const BUSINESS_TAX_JAR_BALANCE_LKR = 15070;

const PERSONAL_SNAPSHOTS = {
  "SEY-USR-003": {
    accountHolder: "Sunil Bandara",
    totalBalanceLkr: 73400,
    savingsBalanceLkr: 23400,
    householdSpentLkr: 18200,
    recentExpenses: [
      {
        merchant: "May loan repayment",
        amount_lkr: 45000,
        timestamp: "2026-05-20T09:00:00Z",
        type: "debit",
      },
      {
        merchant: "Household groceries",
        amount_lkr: 9200,
        timestamp: "2026-05-12T12:00:00Z",
        type: "debit",
      },
      {
        merchant: "Fuel",
        amount_lkr: 5000,
        timestamp: "2026-05-10T16:30:00Z",
        type: "debit",
      },
      {
        merchant: "Dialog Mobile",
        amount_lkr: 4000,
        timestamp: "2026-05-08T10:00:00Z",
        type: "debit",
      },
    ] satisfies Pick<Transaction, "merchant" | "amount_lkr" | "timestamp" | "type">[],
  },
};

interface AssistantProfile {
  userId: string;
  accountHolder: string;
  role: "diaspora" | "family" | "borrower" | "business";
  loan?: Loan;
  hasNoLoan?: boolean;
}

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
const HELP_KEYWORDS = ["what can", "what else", "things", "help", "options", "list"];
const BALANCE_KEYWORDS = ["balance", "available", "money", "how much do i have", "funds"];
const SAVINGS_KEYWORDS = ["saving", "savings", "save", "saved", "buffer"];
const BUCKET_KEYWORDS = ["bucket", "allocation", "school", "household"];
const LOAN_KEYWORDS = [
  "loan",
  "payment",
  "repayment",
  "installment",
  "instalment",
  "emi",
  "due",
  "paid",
  "outstanding",
  "debt",
  "interest",
  "health",
];
const REMITTANCE_KEYWORDS = [
  "remittance",
  "transfer",
  "sent",
  "sender",
  "nimal",
  "gbp",
  "fx",
  "exchange",
  "tempo",
];
const TRANSACTION_KEYWORDS = ["transaction", "transactions", "merchant", "recent", "purchase"];
const BUSINESS_KEYWORDS = [
  "business",
  "profit",
  "revenue",
  "income",
  "margin",
  "p&l",
  "pl",
  "sales",
  "tax",
  "supplier",
  "wages",
  "cash flow",
  "cashflow",
];

function formatLkr(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function normalizeMessage(message: string): string {
  return message.toLowerCase().replace(/[?!.,]/g, "").replace(/\s+/g, " ").trim();
}

function hasAnyKeyword(message: string, keywords: string[]): boolean {
  return keywords.some((keyword) => message.includes(keyword));
}

function getProfile(userId: string): AssistantProfile {
  if (userId === "SEY-ACC-002") {
    return {
      userId,
      accountHolder: MOCK_WALLET.account_holder,
      role: "family",
      hasNoLoan: true,
    };
  }

  if (userId === "SEY-USR-003") {
    return {
      userId,
      accountHolder: PERSONAL_SNAPSHOTS["SEY-USR-003"].accountHolder,
      role: "borrower",
      loan: MOCK_LOAN_SUNIL,
    };
  }

  if (userId === "SEY-BIZ-001") {
    return {
      userId,
      accountHolder: "Suresh Silva",
      role: "business",
    };
  }

  return {
    userId: "SEY-USR-001",
    accountHolder: "Nimal Fernando",
    role: "diaspora",
    loan: MOCK_LOAN_NIMAL,
  };
}

function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function getDaysUntil(date: string): number {
  const dueDate = new Date(`${date}T00:00:00Z`);
  return Math.round((dueDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function getPaidAmount(loan: Loan): number {
  return loan.schedule
    .filter((entry) => entry.status === "PAID")
    .reduce((total, entry) => total + entry.amount_lkr, 0);
}

function getMissedPayments(loan: Loan) {
  return loan.schedule.filter((entry) => entry.status === "MISSED");
}

function getUpcomingPayments(loan: Loan) {
  return loan.schedule.filter((entry) => entry.status === "UPCOMING");
}

function getWalletDebitTransactions() {
  return MOCK_WALLET.recent_transactions
    .filter((transaction) => transaction.type === "debit")
    .sort((a, b) => b.amount_lkr - a.amount_lkr);
}

function getWalletExpenseSummary(includeOnlyBiggest: boolean): string {
  const debitTransactions = getWalletDebitTransactions();

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

function getPersonalExpenseSummary(includeOnlyBiggest: boolean): string {
  const snapshot = PERSONAL_SNAPSHOTS["SEY-USR-003"];
  const debitTransactions = [...snapshot.recentExpenses].sort(
    (a, b) => b.amount_lkr - a.amount_lkr
  );
  const topTransactions = debitTransactions
    .slice(0, includeOnlyBiggest ? 1 : 3)
    .map((transaction) => `${transaction.merchant} (${formatLkr(transaction.amount_lkr)})`)
    .join("; ");

  if (includeOnlyBiggest) {
    return `Your largest recent expense was ${topTransactions}. Beyond that, household expenses total ${formatLkr(snapshot.householdSpentLkr)} this month.`;
  }

  return `Your recent expenses include ${topTransactions}. Household expenses total ${formatLkr(snapshot.householdSpentLkr)} this month, and your savings balance is ${formatLkr(snapshot.savingsBalanceLkr)}.`;
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

function getExpenseResponse(profile: AssistantProfile, message: string): string {
  const includeOnlyBiggest = hasAnyKeyword(message, BIGGEST_EXPENSE_KEYWORDS);

  if (profile.role === "business") {
    return getBusinessExpenseSummary(includeOnlyBiggest);
  }

  if (profile.role === "borrower") {
    return getPersonalExpenseSummary(includeOnlyBiggest);
  }

  return getWalletExpenseSummary(includeOnlyBiggest);
}

function getHelpResponse(profile: AssistantProfile): string {
  if (profile.role === "business") {
    return "I can help with your business account data: weekly revenue, expenses, profit and margin, expense categories, top supplier/wage/utility payments, recent sales, tax jar balance, and simple cash-flow suggestions. Try asking: \"what was my profit this week?\" or \"show my top business expenses\".";
  }

  const loanCapability = profile.hasNoLoan
    ? "confirm whether this account has an active loan"
    : "loan due dates, outstanding balance, payments made, health score, and missed payments";

  return `I can help with your account data: total and bucket balances, savings, school/household spending, latest remittance details, recent transactions, biggest expenses, and ${loanCapability}. Try asking: "what is my total balance?", "show my recent transactions", or "how is my loan doing?".`;
}

function getWalletBalanceResponse(message: string): string {
  const requestedBucket = MOCK_WALLET.buckets.find((bucket) =>
    message.includes(bucket.label.toLowerCase())
  );

  if (requestedBucket) {
    return `Your ${requestedBucket.label} bucket balance is ${formatLkr(requestedBucket.balance_lkr)}. It receives ${requestedBucket.allocation_pct}% of each remittance and has spent ${formatLkr(requestedBucket.spent_lkr)} this month.`;
  }

  const savingsBucket = MOCK_WALLET.buckets.find((bucket) => bucket.label === "Savings");
  if (hasAnyKeyword(message, SAVINGS_KEYWORDS) && savingsBucket) {
    return `Your savings bucket currently holds ${formatLkr(savingsBucket.balance_lkr)}. This is ${savingsBucket.allocation_pct}% of the last remittance of ${formatLkr(MOCK_WALLET.last_remittance.amount_lkr)} sent on ${MOCK_WALLET.last_remittance.date}, and no savings withdrawals are shown this month.`;
  }

  const bucketBreakdown = MOCK_WALLET.buckets
    .map((bucket) => `${bucket.label}: ${formatLkr(bucket.balance_lkr)}`)
    .join(", ");

  return `Your family wallet total balance is ${formatLkr(MOCK_WALLET.total_balance_lkr)}. Bucket balances are ${bucketBreakdown}.`;
}

function getPersonalBalanceResponse(profile: AssistantProfile, message: string): string {
  if (profile.role === "borrower") {
    const snapshot = PERSONAL_SNAPSHOTS["SEY-USR-003"];

    if (hasAnyKeyword(message, SAVINGS_KEYWORDS)) {
      return `Your savings account holds ${formatLkr(snapshot.savingsBalanceLkr)}. Because your loan health is ${profile.loan?.health_score.replace("_", " ")}, keeping this buffer intact can help with the next repayment.`;
    }

    return `Your available account balance is ${formatLkr(snapshot.totalBalanceLkr)}, including ${formatLkr(snapshot.savingsBalanceLkr)} in savings. Your next loan payment is ${formatLkr(profile.loan?.monthly_payment_lkr ?? 0)}, so keep that amount protected.`;
  }

  if (profile.role === "business") {
    return `I can see your business P&L and tax jar rather than a live current-account balance. For ${MOCK_PL_SUMMARY.week_label.toLowerCase()}, revenue is ${formatLkr(MOCK_PL_SUMMARY.revenue_lkr)}, expenses are ${formatLkr(MOCK_PL_SUMMARY.expenses_lkr)}, net profit is ${formatLkr(MOCK_PL_SUMMARY.net_lkr)}, and your tax jar balance is ${formatLkr(BUSINESS_TAX_JAR_BALANCE_LKR)}.`;
  }

  return getWalletBalanceResponse(message);
}

function getBucketResponse(message: string): string {
  const requestedBucket = MOCK_WALLET.buckets.find((bucket) =>
    message.includes(bucket.label.toLowerCase())
  );

  if (requestedBucket) {
    return `The ${requestedBucket.label} bucket is set to ${requestedBucket.allocation_pct}% of each remittance. It has ${formatLkr(requestedBucket.balance_lkr)} available and ${formatLkr(requestedBucket.spent_lkr)} spent this month.`;
  }

  const bucketBreakdown = MOCK_WALLET.buckets
    .map(
      (bucket) =>
        `${bucket.label}: ${bucket.allocation_pct}% allocation, ${formatLkr(bucket.balance_lkr)} available, ${formatLkr(bucket.spent_lkr)} spent`
    )
    .join("; ");

  return `Your remittance is split across buckets like this: ${bucketBreakdown}.`;
}

function getLoanResponse(profile: AssistantProfile, message: string): string {
  if (profile.hasNoLoan || !profile.loan) {
    return `There is no active loan linked to ${profile.accountHolder}'s account (${profile.userId}). I can still help with balances, bucket spending, remittances, and recent transactions.`;
  }

  const { loan } = profile;
  const daysUntilDue = getDaysUntil(loan.next_payment_date);
  const paidAmount = getPaidAmount(loan);
  const paymentsRemaining = loan.total_payments - loan.payments_made;
  const progressPct = Math.round((loan.payments_made / loan.total_payments) * 100);
  const missedPayments = getMissedPayments(loan);
  const nextPayment = getUpcomingPayments(loan)[0];

  if (message.includes("paid") || message.includes("made") || message.includes("progress")) {
    const missedNote =
      missedPayments.length > 0
        ? ` You have ${missedPayments.length} missed payment: ${missedPayments
            .map((entry) => `#${entry.month} due ${formatShortDate(entry.due_date)}`)
            .join(", ")}.`
        : "";

    return `You've paid ${formatLkr(paidAmount)} so far (${loan.payments_made} of ${loan.total_payments} payments, ${progressPct}% complete). Outstanding balance is ${formatLkr(loan.outstanding_lkr)} with ${paymentsRemaining} payments remaining.${missedNote}`;
  }

  if (message.includes("outstanding") || message.includes("balance") || message.includes("debt")) {
    return `Your ${loan.type.toLowerCase()} outstanding balance is ${formatLkr(loan.outstanding_lkr)}. The original disbursed amount was ${formatLkr(loan.disbursed_lkr)}, monthly payment is ${formatLkr(loan.monthly_payment_lkr)}, and interest rate is ${loan.interest_rate_pct}%.`;
  }

  if (message.includes("health") || message.includes("risk") || message.includes("missed")) {
    const missedNote =
      missedPayments.length > 0
        ? ` There ${missedPayments.length === 1 ? "is" : "are"} ${missedPayments.length} missed payment${missedPayments.length === 1 ? "" : "s"}, so catching up should be the priority.`
        : " No missed payments are shown.";

    return `Your loan health is ${loan.health_score.replace("_", " ")}.${missedNote} Next payment is ${formatLkr(nextPayment?.amount_lkr ?? loan.monthly_payment_lkr)} due on ${formatShortDate(loan.next_payment_date)}.`;
  }

  return `Your next loan payment of ${formatLkr(loan.monthly_payment_lkr)} is due on ${formatShortDate(loan.next_payment_date)} (${daysUntilDue} days from now). You've made ${loan.payments_made} of ${loan.total_payments} payments (${progressPct}% complete), with ${formatLkr(loan.outstanding_lkr)} outstanding.`;
}

function getRemittanceResponse(): string {
  const { last_remittance: remittance } = MOCK_WALLET;
  const bucketBreakdown = MOCK_WALLET.buckets
    .map((bucket) => `${bucket.allocation_pct}% to ${bucket.label}`)
    .join(", ");

  return `The last remittance was ${formatLkr(remittance.amount_lkr)} (${remittance.amount_gbp.toLocaleString("en-LK")} GBP) from ${MOCK_WALLET.linked_sender} on ${remittance.date} via ${remittance.provider}. The FX rate was ${remittance.fx_rate}, and it was allocated ${bucketBreakdown}.`;
}

function getRecentTransactionsResponse(profile: AssistantProfile): string {
  if (profile.role === "business") {
    const transactions = MOCK_BUSINESS_TRANSACTIONS.slice(0, 5)
      .map(
        (transaction) =>
          `${transaction.type === "credit" ? "in" : "out"} ${formatLkr(transaction.amount_lkr)} - ${transaction.merchant}`
      )
      .join("; ");

    return `Your latest business transactions are: ${transactions}.`;
  }

  if (profile.role === "borrower") {
    const transactions = PERSONAL_SNAPSHOTS["SEY-USR-003"].recentExpenses
      .slice(0, 4)
      .map((transaction) => `${transaction.merchant}: ${formatLkr(transaction.amount_lkr)}`)
      .join("; ");

    return `Your recent account activity includes: ${transactions}.`;
  }

  const transactions = MOCK_WALLET.recent_transactions
    .slice(0, 5)
    .map(
      (transaction) =>
        `${transaction.merchant}: ${formatLkr(transaction.amount_lkr)} from ${transaction.bucket_label}`
    )
    .join("; ");

  return `Your latest wallet transactions are: ${transactions}.`;
}

function getBusinessResponse(message: string): string {
  if (message.includes("tax")) {
    return `Your tax jar balance is ${formatLkr(BUSINESS_TAX_JAR_BALANCE_LKR)}. The app can add 10% of incoming business income to the jar automatically when the rule is active.`;
  }

  if (message.includes("revenue") || message.includes("income") || message.includes("sales")) {
    return `Revenue for ${MOCK_PL_SUMMARY.week_label.toLowerCase()} is ${formatLkr(MOCK_PL_SUMMARY.revenue_lkr)}. Recent income includes cash sales and jobs such as ${MOCK_BUSINESS_TRANSACTIONS.filter((transaction) => transaction.type === "credit")
      .slice(0, 3)
      .map((transaction) => `${transaction.merchant} (${formatLkr(transaction.amount_lkr)})`)
      .join("; ")}.`;
  }

  if (message.includes("margin")) {
    return `Your margin is ${MOCK_PL_SUMMARY.margin_pct}%, up from ${MOCK_PL_SUMMARY.previous_margin_pct}% previously. Net profit is ${formatLkr(MOCK_PL_SUMMARY.net_lkr)} on ${formatLkr(MOCK_PL_SUMMARY.revenue_lkr)} revenue.`;
  }

  return `For ${MOCK_PL_SUMMARY.week_label.toLowerCase()}, revenue is ${formatLkr(MOCK_PL_SUMMARY.revenue_lkr)}, expenses are ${formatLkr(MOCK_PL_SUMMARY.expenses_lkr)}, and net profit is ${formatLkr(MOCK_PL_SUMMARY.net_lkr)} at a ${MOCK_PL_SUMMARY.margin_pct}% margin.`;
}

export function getMockChatResponse(userId: string, message: string): string {
  const profile = getProfile(userId);
  const lower = normalizeMessage(message);

  if (hasAnyKeyword(lower, HELP_KEYWORDS)) {
    return getHelpResponse(profile);
  }

  if (hasAnyKeyword(lower, LOAN_KEYWORDS)) {
    return getLoanResponse(profile, lower);
  }

  if (hasAnyKeyword(lower, EXPENSE_KEYWORDS)) {
    return getExpenseResponse(profile, lower);
  }

  if (hasAnyKeyword(lower, BUSINESS_KEYWORDS) && profile.role === "business") {
    return getBusinessResponse(lower);
  }

  if (hasAnyKeyword(lower, BALANCE_KEYWORDS) || hasAnyKeyword(lower, SAVINGS_KEYWORDS)) {
    return getPersonalBalanceResponse(profile, lower);
  }

  if (hasAnyKeyword(lower, BUCKET_KEYWORDS) && profile.role !== "business") {
    return getBucketResponse(lower);
  }

  if (hasAnyKeyword(lower, REMITTANCE_KEYWORDS) && profile.role !== "business") {
    return getRemittanceResponse();
  }

  if (hasAnyKeyword(lower, TRANSACTION_KEYWORDS)) {
    return getRecentTransactionsResponse(profile);
  }

  return `${getHelpResponse(profile)} I can only answer from the demo account data I can see, so ask me about one of those areas and I'll be more specific.`;
}
