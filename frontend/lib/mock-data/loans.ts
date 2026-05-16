import { Loan } from "@/types";

export const MOCK_LOAN_NIMAL: Loan = {
  loan_id: "LN-001",
  user_id: "SEY-USR-001",
  type: "Personal Loan",
  purpose: "Home Renovation",
  disbursed_lkr: 720000,
  outstanding_lkr: 480000,
  monthly_payment_lkr: 22000,
  payments_made: 24,
  total_payments: 36,
  next_payment_date: "2026-06-01",
  health_score: "ON_TRACK",
  interest_rate_pct: 14.5,
  schedule: Array.from({ length: 36 }, (_, i) => ({
    month: i + 1,
    due_date: new Date(2024, 5 + i, 1).toISOString().split("T")[0],
    amount_lkr: 22000,
    status: i < 24 ? "PAID" as const : "UPCOMING" as const,
  })),
};

export const MOCK_LOAN_SUNIL: Loan = {
  loan_id: "LN-002",
  user_id: "SEY-USR-003",
  type: "Business Loan",
  purpose: "Vehicle Purchase",
  disbursed_lkr: 1500000,
  outstanding_lkr: 1125000,
  monthly_payment_lkr: 45000,
  payments_made: 10,
  total_payments: 48,
  next_payment_date: "2026-05-20",
  health_score: "AT_RISK",
  interest_rate_pct: 14.0,
  schedule: [
    ...Array.from({ length: 8 }, (_, i) => ({
      month: i + 1,
      due_date: new Date(2025, 7 + i, 20).toISOString().split("T")[0],
      amount_lkr: 45000,
      status: "PAID" as const,
    })),
    {
      month: 9,
      due_date: "2026-04-20",
      amount_lkr: 45000,
      status: "MISSED" as const,
    },
    {
      month: 10,
      due_date: "2026-05-20",
      amount_lkr: 45000,
      status: "PAID" as const,
    },
    ...Array.from({ length: 38 }, (_, i) => ({
      month: i + 11,
      due_date: new Date(2026, 5 + i, 20).toISOString().split("T")[0],
      amount_lkr: 45000,
      status: "UPCOMING" as const,
    })),
  ],
};

export function getMockLoan(userId: string): Loan {
  if (userId === "SEY-USR-003") return MOCK_LOAN_SUNIL;
  return MOCK_LOAN_NIMAL;
}
