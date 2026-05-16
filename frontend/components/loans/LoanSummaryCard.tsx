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
    <Card className="border-seylan-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-seylan-charcoal">
              {loan.type} &middot; {loan.purpose}
            </h2>
          </div>
          <HealthScoreBadge score={loan.health_score} />
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>
            {formatLKR(loan.outstanding_lkr)} outstanding &middot;{" "}
            {formatLKR(loan.disbursed_lkr)} original
          </div>
          <div>
            Interest rate: {loan.interest_rate_pct}% &middot; Monthly:{" "}
            {formatLKR(loan.monthly_payment_lkr)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
