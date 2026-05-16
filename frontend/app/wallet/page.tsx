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
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ErrorState";
import { Transaction } from "@/types";

const FAMILY_ACCOUNT_ID = "SEY-ACC-002";

export default function WalletPage() {
  const { user, mounted } = useCurrentUser();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSpend = useCallback((tx: Transaction, newBalance: number) => {
    fireSpendToast(tx, newBalance);
  }, []);

  const { wallet, transactions, buckets, loading, error, realtimeConnected, refetch } =
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

  if (error && !wallet) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const allocations = Object.fromEntries(
    buckets.map((b) => [b.bucket_id, b.allocation_pct])
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-seylan-charcoal">
        Family Wallet
        {user && (
          <span className="text-sm font-normal text-muted-foreground ml-2">
            Viewing as {user.name}
          </span>
        )}
        <span className="ml-2 rounded-full bg-seylan-mist px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {realtimeConnected ? "Realtime connected" : "Polling fallback"}
        </span>
      </h1>

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
