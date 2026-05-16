"use client";

import { Transaction } from "@/types";
import { TransactionRow } from "./TransactionRow";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionFeedProps {
  transactions: Transaction[];
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  const recent = transactions.slice(0, 10);

  return (
    <Card className="border-seylan-border bg-white/95 shadow-sm">
      <CardContent className="p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
              Activity
            </p>
            <h3 className="font-heading text-lg font-semibold text-seylan-charcoal">
              Recent Transactions
            </h3>
          </div>
          <span className="rounded-full bg-seylan-mist px-3 py-1 text-xs font-medium text-muted-foreground">
            Latest 10
          </span>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-seylan-border bg-seylan-mist/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className="max-h-[360px] overflow-y-auto">
            {recent.map((tx) => (
              <TransactionRow key={tx.transaction_id} transaction={tx} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
