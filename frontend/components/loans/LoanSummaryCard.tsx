"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loan } from "@/types";
import { formatLKR } from "@/lib/utils";
import { HealthScoreBadge } from "./HealthScoreBadge";

interface LoanSummaryCardProps {
  loan: Loan;
}

export function LoanSummaryCard({ loan }: LoanSummaryCardProps) {
  const paidPct = Math.round((loan.payments_made / loan.total_payments) * 100);

  return (
    <Card className="border-seylan-border bg-white/95 shadow-lg shadow-seylan-plum/5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
              Current loan
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-seylan-charcoal">
              {loan.type} &middot; {loan.purpose}
            </h2>
          </div>
          <HealthScoreBadge score={loan.health_score} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Outstanding</div>
            <div className="mt-1 text-xl font-semibold text-seylan-charcoal">
              {formatLKR(loan.outstanding_lkr)}
            </div>
          </div>
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Original</div>
            <div className="mt-1 text-xl font-semibold text-seylan-charcoal">
              {formatLKR(loan.disbursed_lkr)}
            </div>
          </div>
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Progress</div>
            <div className="mt-1 text-xl font-semibold text-seylan-charcoal">
              {paidPct}%
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Monthly payment is {formatLKR(loan.monthly_payment_lkr)} at{" "}
          {loan.interest_rate_pct}% interest.
        </p>
      </CardContent>
    </Card>
  );
}
