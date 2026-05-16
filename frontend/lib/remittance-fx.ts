/** Must match backend /api/fx GBP→LKR demo rate and wallet transfer logic. */
export const GBP_LKR_RATE = 408.3;

/** Integer LKR credited (bank-style rounding from GBP). */
export function gbpToLkr(amountGbp: number): number {
  return Math.round(amountGbp * GBP_LKR_RATE);
}
