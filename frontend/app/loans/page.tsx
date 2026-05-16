"use client";

import { useEffect, useState } from "react";
import { getLoans } from "@/lib/api";
import { Loan } from "@/types";
import { LoanSummaryCard } from "@/components/loans/LoanSummaryCard";
import { RepaymentProgressBar } from "@/components/loans/RepaymentProgressBar";
import { PaymentCountdown } from "@/components/loans/PaymentCountdown";
import { AIAdvisorPanel } from "@/components/loans/AIAdvisorPanel";
import { RepaymentTimeline } from "@/components/loans/RepaymentTimeline";
import { InsightActionStrip } from "@/components/insights/InsightActionStrip";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Bot, CalendarCheck, Gauge, WalletCards } from "lucide-react";

const ASSISTANT_PROMPT =
  "Show me repayment scenarios for my current loan: paying today, paying three days late, and making a partial payment.";

export default function LoansPage() {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = "SEY-USR-001";

  useEffect(() => {
    let cancelled = false;
    getLoans(userId)
      .then((data) => {
        if (cancelled) return;
        const loans = data as Loan | Loan[];
        setLoan(Array.isArray(loans) ? loans[0] : loans);
      })
      .catch(() => { if (!cancelled) setLoan(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) {
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

  const progressPct = Math.round((loan.payments_made / loan.total_payments) * 100);
  const nextDate = new Date(loan.next_payment_date);
  const daysUntil = Math.max(
    0,
    Math.ceil((nextDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const riskCopy =
    loan.health_score === "ON_TRACK"
      ? "On track"
      : loan.health_score === "AT_RISK"
        ? "Watch closely"
        : "Needs action";

  return (
    <div data-module="loans" className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Loan health"
        title="Understand your repayment position at a glance"
        description="A calmer loan dashboard that explains what is due next, how much is complete, and which action keeps the account healthy."
        
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <LoanSummaryCard loan={loan} />
        <PaymentCountdown loan={loan} />
      </div>

      <InsightActionStrip
        eyebrow="Repayment signal"
        title="Your next safest move"
        insights={[
          {
            label: "Health",
            value: riskCopy,
            detail:
              loan.health_score === "ON_TRACK"
                ? "Payment pattern is healthy. Keep the next date protected."
                : "A payment reminder and partial plan can reduce stress now.",
            tone: loan.health_score === "ON_TRACK" ? "success" : "alert",
            icon: Gauge,
          },
          {
            label: "Due window",
            value: `${daysUntil} days`,
            detail: "Paying before the due date keeps the account from sliding into risk.",
            tone: daysUntil <= 3 ? "alert" : "info",
            icon: CalendarCheck,
          },
          {
            label: "Progress",
            value: `${progressPct}%`,
            detail: `${loan.payments_made} of ${loan.total_payments} repayments are already complete.`,
            tone: "neutral",
            icon: WalletCards,
          },
        ]}
        actions={[
          {
            label: "Ask scenario",
            icon: Bot,
            href: `/assistant?prompt=${encodeURIComponent(ASSISTANT_PROMPT)}`,
          },
          { label: "View timeline", icon: CalendarCheck, href: "#repayment-timeline" },
          { label: "Risk check", icon: AlertTriangle, href: "#loan-advisor" },
        ]}
      />

      <RepaymentProgressBar loan={loan} />
      <section id="loan-advisor" className="scroll-mt-6">
        <AIAdvisorPanel userId={userId} />
      </section>
      <section id="repayment-timeline" className="scroll-mt-6">
        <RepaymentTimeline schedule={loan.schedule} />
      </section>
    </div>
  );
}
