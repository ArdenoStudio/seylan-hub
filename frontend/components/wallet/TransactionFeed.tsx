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
    <Card className="border-seylan-border">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-seylan-charcoal mb-3">
          Recent Transactions
        </h3>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
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
