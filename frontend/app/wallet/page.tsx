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
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types";

const FAMILY_ACCOUNT_ID = "SEY-ACC-002";

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

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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

      <BucketGrid buckets={buckets} />

      <AllocationEditor
        buckets={buckets}
        onSave={(newAllocations) => {
          localStorage.setItem(
            "seylan_allocation_rules",
            JSON.stringify(newAllocations)
          );
        }}
      />

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
