/** Must match backend /api/fx GBP→LKR demo rate and wallet transfer logic. */
export const GBP_LKR_RATE = 408.3;

/** Integer LKR credited (bank-style rounding from GBP). */
export function gbpToLkr(amountGbp: number): number {
  return Math.round(amountGbp * GBP_LKR_RATE);
}

export interface RemittanceCurrency {
  code: string;
  name: string;
  flag: string;
  lkrRate: number;
  symbol: string;
}

/** Demo FX rates to LKR. Update alongside backend /api/fx when rates change. */
export const REMITTANCE_CURRENCIES: RemittanceCurrency[] = [
  { code: "GBP", name: "British Pound",    flag: "🇬🇧", lkrRate: 408.3,  symbol: "£" },
  { code: "USD", name: "US Dollar",         flag: "🇺🇸", lkrRate: 320.5,  symbol: "$" },
  { code: "EUR", name: "Euro",              flag: "🇪🇺", lkrRate: 348.2,  symbol: "€" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", lkrRate: 208.4,  symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar",   flag: "🇨🇦", lkrRate: 234.7,  symbol: "C$" },
  { code: "AED", name: "UAE Dirham",        flag: "🇦🇪", lkrRate:  87.3,  symbol: "د.إ" },
  { code: "SGD", name: "Singapore Dollar",  flag: "🇸🇬", lkrRate: 238.1,  symbol: "S$" },
  { code: "JPY", name: "Japanese Yen",      flag: "🇯🇵", lkrRate:   2.14, symbol: "¥" },
];

export function toLkr(amount: number, currency: RemittanceCurrency): number {
  return Math.round(amount * currency.lkrRate);
}
