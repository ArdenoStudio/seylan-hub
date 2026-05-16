"use client";

import { useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useWalletRealtime } from "@/hooks/useWalletRealtime";
import { BucketGrid } from "@/components/wallet/BucketGrid";
import { AllocationEditor } from "@/components/wallet/AllocationEditor";
import { TransactionFeed } from "@/components/wallet/TransactionFeed";
import { LastRemittanceBanner } from "@/components/wallet/LastRemittanceBanner";
import { SendMoneyModal } from "@/components/wallet/SendMoneyModal";
import { fireSpendToast } from "@/components/wallet/SpendNotificationToast";
import { InsightActionStrip } from "@/components/insights/InsightActionStrip";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types";
import { ArrowRightLeft, Bot, PieChart, ShieldCheck } from "lucide-react";

const FAMILY_ACCOUNT_ID = "SEY-ACC-002";
const ASSISTANT_PROMPT =
  "Explain the latest family wallet activity and tell me whether any bucket needs attention before the next transfer.";

export default function WalletPage() {
  const { user, mounted } = useCurrentUser();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSpend = useCallback((tx: Transaction, newBalance: number) => {
    fireSpendToast(tx, newBalance);
  }, []);

  const { wallet, transactions, buckets, loading, refetch } =
    useWalletRealtime({
      accountId: FAMILY_ACCOUNT_ID,
      onSpend: handleSpend,
    });

  if (!mounted || loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const allocations = Object.fromEntries(
    buckets.map((b) => [b.bucket_id, b.allocation_pct])
  );
  const mostUsedBucket = [...buckets].sort((a, b) => {
    const aPct =
      a.balance_lkr + a.spent_lkr > 0
        ? a.spent_lkr / (a.balance_lkr + a.spent_lkr)
        : 0;
    const bPct =
      b.balance_lkr + b.spent_lkr > 0
        ? b.spent_lkr / (b.balance_lkr + b.spent_lkr)
        : 0;
    return bPct - aPct;
  })[0];
  const latestSpend = transactions.find((tx) => tx.amount_lkr < 0);

  return (
    <div data-module="wallet" className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Diaspora family wallet"
        title="Track money sent home with confidence"
        description="See the latest remittance, how the family is using each bucket, and adjust the next split before sending again."
        meta={
          user && (
            <span className="inline-flex rounded-full border border-seylan-border bg-white/70 px-3 py-1 text-xs font-medium text-seylan-charcoal">
              Viewing as {user.name}
            </span>
          )
        }
        action={
          <Button onClick={() => setModalOpen(true)} className="rounded-full">
            Send Money
          </Button>
        }
      />

      {wallet && (
        <LastRemittanceBanner
          wallet={wallet}
          onSendAgain={() => setModalOpen(true)}
        />
      )}

      <InsightActionStrip
        eyebrow="Family money signal"
        title="What needs attention before the next transfer"
        insights={[
          {
            label: "Spend watch",
            value: mostUsedBucket
              ? `${Math.round(
                  (mostUsedBucket.spent_lkr /
                    (mostUsedBucket.balance_lkr + mostUsedBucket.spent_lkr ||
                      1)) *
                    100
                )}%`
              : "0%",
            detail: mostUsedBucket
              ? `${mostUsedBucket.label} is the fastest-moving bucket this cycle.`
              : "No bucket movement yet.",
            tone: "alert",
            icon: PieChart,
          },
          {
            label: "Latest activity",
            value: latestSpend ? latestSpend.merchant : "No spend",
            detail: latestSpend
              ? "Tap the Assistant to explain whether this looks usual."
              : "The wallet is quiet after the latest remittance.",
            tone: "info",
            icon: Bot,
          },
          {
            label: "Confidence",
            value: "Protected",
            detail: "Allocations are still separated for school, household, and savings.",
            tone: "success",
            icon: ShieldCheck,
          },
        ]}
        actions={[
          {
            label: "Send again",
            icon: ArrowRightLeft,
            onClick: () => setModalOpen(true),
          },
          {
            label: "Ask Assistant",
            icon: Bot,
            href: `/assistant?prompt=${encodeURIComponent(ASSISTANT_PROMPT)}`,
          },
          { label: "Tune split", icon: PieChart, href: "#allocation-editor" },
        ]}
      />

      <BucketGrid buckets={buckets} />

      <section id="allocation-editor" className="scroll-mt-6">
        <AllocationEditor
          buckets={buckets}
          onSave={(newAllocations) => {
            localStorage.setItem(
              "seylan_allocation_rules",
              JSON.stringify(newAllocations)
            );
          }}
        />
      </section>

      <TransactionFeed transactions={transactions} />

      <SendMoneyModal
        senderId={user?.id ?? "SEY-USR-001"}
        recipientId={FAMILY_ACCOUNT_ID}
        allocations={allocations}
        onSuccess={refetch}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
