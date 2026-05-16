"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Loan } from "@/types";
import { formatLKR } from "@/lib/utils";

interface RepaymentProgressBarProps {
  loan: Loan;
}

export function RepaymentProgressBar({ loan }: RepaymentProgressBarProps) {
  const pct = Math.round((loan.payments_made / loan.total_payments) * 100);
  const remaining = loan.total_payments - loan.payments_made;
  const paidLkr = loan.payments_made * loan.monthly_payment_lkr;
  const remainingLkr = remaining * loan.monthly_payment_lkr;

  return (
    <Card className="border-seylan-border bg-white/95 shadow-sm">
      <CardContent className="p-5 space-y-3">
        <div className="flex flex-col justify-between gap-1 text-sm sm:flex-row">
          <span className="text-seylan-charcoal font-medium">
            Paid: {loan.payments_made} of {loan.total_payments} payments
          </span>
          <span className="text-muted-foreground">
            Remaining: {remaining}
          </span>
        </div>
        <Progress value={pct} className="h-3" />
        <div className="text-center text-sm font-semibold text-seylan-charcoal">
          {pct}% complete
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatLKR(paidLkr)} paid</span>
          <span>{formatLKR(remainingLkr)} remaining</span>
        </div>
      </CardContent>
    </Card>
  );
}
