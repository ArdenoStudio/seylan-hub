"use client";

import { useState, useCallback, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PlSummaryCard } from "@/components/business/PlSummaryCard";
import { ExpenseBreakdown } from "@/components/business/ExpenseBreakdown";
import { TaxJarPanel } from "@/components/business/TaxJarPanel";
import { CategorisedTransactionFeed } from "@/components/business/CategorisedTransactionFeed";
import { InsightActionStrip } from "@/components/insights/InsightActionStrip";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types";
import { Bot, PiggyBank, ReceiptText, TrendingUp } from "lucide-react";

const BUSINESS_USER_ID = "SEY-BIZ-001";
const INITIAL_TAX_JAR_BALANCE = 15070;

export default function BusinessPage() {
  const { mounted, user, switchUser } = useCurrentUser();
  const [extraTransactions, setExtraTransactions] = useState<Transaction[]>([]);

  const handleNewTransaction = useCallback((tx: Transaction) => {
    setExtraTransactions((prev) => [tx, ...prev]);
  }, []);

  useEffect(() => {
    if (mounted && user?.id !== BUSINESS_USER_ID) {
      switchUser(BUSINESS_USER_ID);
    }
  }, [mounted, user?.id, switchUser]);

  if (!mounted) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="SME bookkeeper"
        title="Silva Hardware & Electricals"
        description="A weekly finance cockpit for revenue, spending, tax savings, and AI-assisted transaction categories."
        meta={
          <span className="inline-flex rounded-full border border-seylan-border bg-white/70 px-3 py-1 text-xs font-medium text-seylan-charcoal">
            Gampaha
          </span>
        }
      />

      <InsightActionStrip
        eyebrow="SME command center"
        title="Keep cash, categories, and tax moving together"
        insights={[
          {
            label: "Cash runway",
            value: "14 days",
            detail: "Current weekly margin can cover two more restock cycles.",
            tone: "success",
            icon: TrendingUp,
          },
          {
            label: "Tax jar",
            value: "72%",
            detail: "Projected weekly liability is mostly covered before month-end.",
            tone: "info",
            icon: PiggyBank,
          },
          {
            label: "Needs review",
            value: `${extraTransactions.length || 3}`,
            detail: "Recent transactions should be checked before filing.",
            tone: "neutral",
            icon: ReceiptText,
          },
        ]}
        actions={[
          { label: "Ask bookkeeper", icon: Bot, href: "/assistant" },
          { label: "Review tax jar", icon: PiggyBank, href: "#tax-jar" },
          { label: "Check categories", icon: ReceiptText, href: "#business-feed" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PlSummaryCard userId={BUSINESS_USER_ID} />
          <ExpenseBreakdown userId={BUSINESS_USER_ID} />
        </div>
        <div id="tax-jar">
          <TaxJarPanel
            userId={BUSINESS_USER_ID}
            initialBalance={INITIAL_TAX_JAR_BALANCE}
            onNewTransaction={handleNewTransaction}
          />
        </div>
      </div>

      <section id="business-feed">
        <CategorisedTransactionFeed
          userId={BUSINESS_USER_ID}
          extraTransactions={extraTransactions}
        />
      </section>
    </div>
  );
}
