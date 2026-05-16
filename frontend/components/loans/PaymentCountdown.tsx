"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loan } from "@/types";
import { formatLKR } from "@/lib/utils";

interface PaymentCountdownProps {
  loan: Loan;
}

export function PaymentCountdown({ loan }: PaymentCountdownProps) {
  const nextDate = new Date(loan.next_payment_date);
  const now = new Date();
  const diffMs = nextDate.getTime() - now.getTime();
  const daysUntil = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return (
    <Card className="border-seylan-border">
      <CardContent className="p-5 text-center">
        <div className="text-3xl font-bold text-seylan-charcoal">
          {formatLKR(loan.monthly_payment_lkr)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          due in {daysUntil} days
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {nextDate.toLocaleDateString("en-LK", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
}
