export type HealthScore = "ON_TRACK" | "AT_RISK" | "CRITICAL";
export type Language = "en" | "si";
export type MessageRole = "user" | "assistant" | "system";

export interface Bucket {
  bucket_id: string;
  label: string;
  allocation_pct: number;
  balance_lkr: number;
  spent_lkr: number;
  icon: "school" | "household" | "savings";
  colour: string;
}

export interface Transaction {
  transaction_id: string;
  account_id: string;
  bucket_id?: string;
  bucket_label?: string;
  amount_lkr: number;
  merchant: string;
  category?: string;
  category_en?: string;
  category_si?: string;
  subcategory?: string;
  timestamp: string;
  type: "credit" | "debit";
  description?: string;
}

export interface Loan {
  loan_id: string;
  user_id: string;
  type: string;
  purpose: string;
  disbursed_lkr: number;
  outstanding_lkr: number;
  monthly_payment_lkr: number;
  payments_made: number;
  total_payments: number;
  next_payment_date: string;
  health_score: HealthScore;
  interest_rate_pct: number;
  schedule: ScheduleEntry[];
}

export interface ScheduleEntry {
  month: number;
  due_date: string;
  amount_lkr: number;
  /** `"DUE"` is an alias for `"UPCOMING"` (some API payloads). */
  status: "PAID" | "UPCOMING" | "MISSED" | "DUE";
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  language: Language;
}

export interface AccountContext {
  user_id: string;
  account_holder: string;
  accounts: string[];
  balance_lkr: number;
  language_preference: Language;
}

export interface FixedDeposit {
  fd_id: string;
  principal_lkr: number;
  interest_rate_pct: number;
  maturity_date: string;
  status: "ACTIVE" | "MATURED";
}

export interface WalletState {
  account_id: string;
  account_holder: string;
  linked_sender: string;
  total_balance_lkr: number;
  last_remittance: {
    amount_lkr: number;
    amount_gbp: number;
    fx_rate: number;
    date: string;
    provider: string;
  };
  buckets: Bucket[];
  recent_transactions: Transaction[];
}

export interface PlSummary {
  user_id: string;
  week_label: string;
  revenue_lkr: number;
  expenses_lkr: number;
  net_lkr: number;
  margin_pct: number;
  previous_margin_pct: number;
  expense_breakdown: Record<string, number>;
  previous_expense_breakdown: Record<string, number>;
}

export interface TaxJar {
  user_id: string;
  balance_lkr: number;
  rule: string;
  status: "ACTIVE" | "PAUSED";
}
