"use client";

import { useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PlSummaryCard } from "@/components/business/PlSummaryCard";
import { ExpenseBreakdown } from "@/components/business/ExpenseBreakdown";
import { TaxJarPanel } from "@/components/business/TaxJarPanel";
import { CategorisedTransactionFeed } from "@/components/business/CategorisedTransactionFeed";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types";

const BUSINESS_USER_ID = "SEY-BIZ-001";
const INITIAL_TAX_JAR_BALANCE = 15070;

export default function BusinessPage() {
  const { mounted } = useCurrentUser();
  const [extraTransactions, setExtraTransactions] = useState<Transaction[]>([]);

  const handleNewTransaction = useCallback((tx: Transaction) => {
    setExtraTransactions((prev) => [tx, ...prev]);
  }, []);

  if (!mounted) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PlSummaryCard userId={BUSINESS_USER_ID} />
          <ExpenseBreakdown userId={BUSINESS_USER_ID} />
        </div>
        <div>
          <TaxJarPanel
            userId={BUSINESS_USER_ID}
            initialBalance={INITIAL_TAX_JAR_BALANCE}
            onNewTransaction={handleNewTransaction}
          />
        </div>
      </div>

      <CategorisedTransactionFeed
        userId={BUSINESS_USER_ID}
        extraTransactions={extraTransactions}
      />
    </div>
  );
}
