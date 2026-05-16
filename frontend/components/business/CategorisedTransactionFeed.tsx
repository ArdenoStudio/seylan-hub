"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/types";
import { getBusinessAccount, postCategorize } from "@/lib/api";
import { formatLKR } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

interface CategorisedTransactionFeedProps {
  userId: string;
  extraTransactions?: Transaction[];
}

export function CategorisedTransactionFeed({
  userId,
  extraTransactions = [],
}: CategorisedTransactionFeedProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const data = (await getBusinessAccount(userId)) as {
          transactions: Transaction[];
        };
        const txs = data.transactions ?? [];

        try {
          const ids = txs.map((t) => t.transaction_id);
          const categories = (await postCategorize({ transaction_ids: ids })) as Record<
            string,
            { category_en: string; category_si: string; subcategory: string }
          >;
          const merged = txs.map((t) => ({
            ...t,
            ...categories[t.transaction_id],
          }));
          setTransactions(merged);
        } catch {
          setTransactions(txs);
        }
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const allTxs = [...extraTransactions, ...transactions];

  const filtered =
    tab === "all"
      ? allTxs
      : tab === "income"
      ? allTxs.filter((t) => t.type === "credit")
      : allTxs.filter((t) => t.type === "debit");

  const groupedByDay = filtered.reduce<Record<string, Transaction[]>>(
    (acc, tx) => {
      const day = new Date(tx.timestamp).toLocaleDateString("en-LK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!acc[day]) acc[day] = [];
      acc[day].push(tx);
      return acc;
    },
    {}
  );

  if (loading) {
    return (
      <Card className="border-seylan-border">
        <CardContent className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-seylan-border">
      <CardContent className="p-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value={tab}>
            <div className="max-h-[480px] overflow-y-auto">
              {Object.entries(groupedByDay).map(([day, txs]) => {
                const dayNet = txs.reduce(
                  (sum, t) =>
                    sum + (t.type === "credit" ? t.amount_lkr : -t.amount_lkr),
                  0
                );
                return (
                  <div key={day} className="mb-4">
                    <div className="sticky top-0 bg-white z-10 flex justify-between items-center py-1 border-b border-seylan-border mb-2">
                      <span className="text-xs font-medium text-seylan-charcoal">
                        {day}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          dayNet >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        Net: {dayNet >= 0 ? "+" : ""}
                        {formatLKR(dayNet)}
                      </span>
                    </div>
                    {txs.map((tx) => (
                      <div
                        key={tx.transaction_id}
                        className="flex items-center justify-between py-2 border-b border-seylan-border/50 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-seylan-charcoal truncate">
                            {tx.description ?? tx.merchant}
                          </div>
                          {tx.category_en && (
                            <CategoryBadge
                              categoryEn={tx.category_en}
                              categorySi={tx.category_si}
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ml-2 ${
                            tx.type === "credit"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}
                          {formatLKR(tx.amount_lkr)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No transactions
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
