"use client";

import { Transaction } from "@/types";
import { formatLKR } from "@/lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const isDebit = transaction.type === "debit";

  return (
    <div className="flex items-center justify-between py-3 border-b border-seylan-border last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-seylan-charcoal truncate">
          {transaction.merchant}
        </div>
        <div className="text-xs text-muted-foreground">
          {transaction.bucket_label} &middot;{" "}
          {new Date(transaction.timestamp).toLocaleDateString("en-LK", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <div
        className={`text-sm font-medium ${
          isDebit ? "text-red-600" : "text-emerald-600"
        }`}
      >
        {isDebit ? "-" : "+"}
        {formatLKR(transaction.amount_lkr)}
      </div>
    </div>
  );
}
