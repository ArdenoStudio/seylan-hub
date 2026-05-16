"use client";

import { useState, useEffect, useCallback } from "react";
import { Bucket, Transaction, WalletState } from "@/types";
import { subscribeToTransactions } from "@/lib/supabase";
import { getFamilyWallet } from "@/lib/api";

interface UseWalletRealtimeOptions {
  accountId: string;
  onSpend?: (transaction: Transaction, newBucketBalance: number) => void;
}

export function useWalletRealtime({ accountId, onSpend }: UseWalletRealtimeOptions) {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await getFamilyWallet(accountId)) as WalletState;
      setWallet(data);
      setBuckets(data.buckets);
      setTransactions(data.recent_transactions);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    const unsubscribe = subscribeToTransactions(accountId, (newTx) => {
      setTransactions((prev) => [newTx, ...prev]);

      setBuckets((prev) => {
        const updated = prev.map((b) => {
          if (b.bucket_id === newTx.bucket_id) {
            const newBalance = b.balance_lkr - newTx.amount_lkr;
            const newSpent = b.spent_lkr + newTx.amount_lkr;
            if (onSpend) onSpend(newTx, newBalance);
            return { ...b, balance_lkr: newBalance, spent_lkr: newSpent };
          }
          return b;
        });
        return updated;
      });
    });

    return unsubscribe;
  }, [accountId, onSpend]);

  return { wallet, transactions, buckets, loading, error, refetch: fetchWallet };
}
