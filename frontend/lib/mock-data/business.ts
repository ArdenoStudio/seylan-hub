import { PlSummary, Transaction } from "@/types";

export const MOCK_PL_SUMMARY: PlSummary = {
  user_id: "SEY-BIZ-001",
  week_label: "Week of 12 May 2026",
  revenue_lkr: 47200,
  expenses_lkr: 31152,
  net_lkr: 16048,
  margin_pct: 34,
  previous_margin_pct: 28.5,
  expense_breakdown: {
    SUPPLIER: 14200,
    WAGES: 8000,
    UTILITIES: 3500,
    RENT: 3000,
    TRANSPORT: 1800,
    MISC: 652,
  },
};

export const MOCK_BUSINESS_TRANSACTIONS: Transaction[] = [
  { transaction_id: "biz-001", account_id: "SEY-BIZ-001", amount_lkr: 12500, merchant: "Kelani Cables - Wire Stock", timestamp: "2026-05-16T09:15:00Z", type: "debit", description: "Kelani Cables - Wire Stock", category_en: "SUPPLIER", category_si: "සැපයුම්කරු" },
  { transaction_id: "biz-002", account_id: "SEY-BIZ-001", amount_lkr: 8200, merchant: "Cash Sale - Electrical Fittings", timestamp: "2026-05-16T10:30:00Z", type: "credit", description: "Cash Sale - Electrical Fittings", category_en: "INCOME", category_si: "ආදායම" },
  { transaction_id: "biz-003", account_id: "SEY-BIZ-001", amount_lkr: 4500, merchant: "Staff Salary - Kamal", timestamp: "2026-05-15T17:00:00Z", type: "debit", description: "Staff Salary - Kamal", category_en: "WAGES", category_si: "වැටුප්" },
  { transaction_id: "biz-004", account_id: "SEY-BIZ-001", amount_lkr: 6800, merchant: "Abans - Switch Stock", timestamp: "2026-05-15T11:20:00Z", type: "debit", description: "Abans - Switch Stock", category_en: "SUPPLIER", category_si: "සැපයුම්කරු" },
  { transaction_id: "biz-005", account_id: "SEY-BIZ-001", amount_lkr: 15300, merchant: "Wiring Job - Mr. Perera (Nugegoda)", timestamp: "2026-05-15T14:45:00Z", type: "credit", description: "Wiring Job - Mr. Perera (Nugegoda)", category_en: "INCOME", category_si: "ආදායම" },
  { transaction_id: "biz-006", account_id: "SEY-BIZ-001", amount_lkr: 3500, merchant: "Ceylon Electricity Board", timestamp: "2026-05-14T09:00:00Z", type: "debit", description: "Ceylon Electricity Board", category_en: "UTILITIES", category_si: "උපයෝගිතා" },
  { transaction_id: "biz-007", account_id: "SEY-BIZ-001", amount_lkr: 9200, merchant: "Cash Sale - LED Bulbs (bulk)", timestamp: "2026-05-14T12:30:00Z", type: "credit", description: "Cash Sale - LED Bulbs (bulk)", category_en: "INCOME", category_si: "ආදායම" },
  { transaction_id: "biz-008", account_id: "SEY-BIZ-001", amount_lkr: 3000, merchant: "Shop Rent - May", timestamp: "2026-05-14T08:00:00Z", type: "debit", description: "Shop Rent - May", category_en: "RENT", category_si: "කුලිය" },
  { transaction_id: "biz-009", account_id: "SEY-BIZ-001", amount_lkr: 3500, merchant: "Staff Salary - Ruwan", timestamp: "2026-05-13T17:00:00Z", type: "debit", description: "Staff Salary - Ruwan", category_en: "WAGES", category_si: "වැටුප්" },
  { transaction_id: "biz-010", account_id: "SEY-BIZ-001", amount_lkr: 5400, merchant: "Cash Sale - Extension Cords", timestamp: "2026-05-13T15:20:00Z", type: "credit", description: "Cash Sale - Extension Cords", category_en: "INCOME", category_si: "ආදායම" },
  { transaction_id: "biz-011", account_id: "SEY-BIZ-001", amount_lkr: 1800, merchant: "PickMe Delivery - Stock Pickup", timestamp: "2026-05-13T10:00:00Z", type: "debit", description: "PickMe Delivery - Stock Pickup", category_en: "TRANSPORT", category_si: "ප්‍රවාහන" },
  { transaction_id: "biz-012", account_id: "SEY-BIZ-001", amount_lkr: 4700, merchant: "Cash Sale - MCBs & Sockets", timestamp: "2026-05-12T14:00:00Z", type: "credit", description: "Cash Sale - MCBs & Sockets", category_en: "INCOME", category_si: "ආදායම" },
  { transaction_id: "biz-013", account_id: "SEY-BIZ-001", amount_lkr: 7800, merchant: "Hemas - Conduit Pipes", timestamp: "2026-05-12T09:30:00Z", type: "debit", description: "Hemas - Conduit Pipes", category_en: "SUPPLIER", category_si: "සැපයුම්කරු" },
  { transaction_id: "biz-014", account_id: "SEY-BIZ-001", amount_lkr: 11000, merchant: "Installation Job - New House (Kadawatha)", timestamp: "2026-05-11T16:00:00Z", type: "credit", description: "Installation Job - New House (Kadawatha)", category_en: "INCOME", category_si: "ආදායම" },
  { transaction_id: "biz-015", account_id: "SEY-BIZ-001", amount_lkr: 652, merchant: "Dialog Internet - Shop WiFi", timestamp: "2026-05-11T08:00:00Z", type: "debit", description: "Dialog Internet - Shop WiFi", category_en: "MISC", category_si: "විවිධ" },
];
