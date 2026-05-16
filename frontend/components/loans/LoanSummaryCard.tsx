"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loan } from "@/types";
import { formatLKR } from "@/lib/utils";
import { HealthScoreBadge } from "./HealthScoreBadge";

interface LoanSummaryCardProps {
  loan: Loan;
}

export function LoanSummaryCard({ loan }: LoanSummaryCardProps) {
  return (
    <Card className="card-glass shadow-brand-lg border-0">
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
        <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Outstanding</div>
            <div className="mt-1 text-xl font-semibold text-seylan-charcoal">
              {formatLKR(loan.outstanding_lkr)}
            </div>
          </div>
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Monthly Payment</div>
            <div className="mt-1 text-xl font-semibold text-seylan-charcoal">
              {formatLKR(loan.monthly_payment_lkr)}
            </div>
          </div>
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Interest Rate</div>
            <div className="mt-1 text-xl font-semibold text-seylan-charcoal">
              {loan.interest_rate_pct}%
            </div>
          </div>
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Original Amount</div>
            <div className="mt-1 text-xl font-semibold text-seylan-charcoal">
              {formatLKR(loan.disbursed_lkr)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
