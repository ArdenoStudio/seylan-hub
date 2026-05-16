"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getLoans } from "@/lib/api";
import { Loan } from "@/types";
import { LoanSummaryCard } from "@/components/loans/LoanSummaryCard";
import { RepaymentProgressBar } from "@/components/loans/RepaymentProgressBar";
import { PaymentCountdown } from "@/components/loans/PaymentCountdown";
import { AIAdvisorPanel } from "@/components/loans/AIAdvisorPanel";
import { RepaymentTimeline } from "@/components/loans/RepaymentTimeline";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoansPage() {
  const { user, mounted } = useCurrentUser();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.id ?? "SEY-USR-001";

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    getLoans(userId)
      .then((data) => {
        const loans = data as Loan | Loan[];
        setLoan(Array.isArray(loans) ? loans[0] : loans);
      })
      .catch(() => setLoan(null))
      .finally(() => setLoading(false));
  }, [userId, mounted]);

  if (!mounted || loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-seylan-charcoal mb-4">
          Loan Dashboard
        </h1>
        <p className="text-muted-foreground">No loan data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-seylan-charcoal">
        Loan Dashboard
        {user && (
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {user.name}
          </span>
        )}
      </h1>

      <LoanSummaryCard loan={loan} />
      <RepaymentProgressBar loan={loan} />
      <PaymentCountdown loan={loan} />
      <AIAdvisorPanel userId={userId} />
      <RepaymentTimeline schedule={loan.schedule} />
    </div>
  );
}
