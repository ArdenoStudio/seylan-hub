"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLKR } from "@/lib/utils";
import { getPlSummary } from "@/lib/api";

interface PlData {
  expense_breakdown: Record<string, number>;
}

interface ExpenseBreakdownProps {
  userId: string;
}

export function ExpenseBreakdown({ userId }: ExpenseBreakdownProps) {
  const [breakdown, setBreakdown] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlSummary(userId)
      .then((res) => {
        const data = res as PlData;
        setBreakdown(data.expense_breakdown);
      })
      .catch(() => setBreakdown(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!breakdown) return null;

  const entries = Object.entries(breakdown).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const maxVal = entries[0]?.[1] ?? 1;

  return (
    <Card className="border-seylan-border bg-white/95 shadow-sm">
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
          Spend categories
        </p>
        <h3 className="mb-4 font-heading text-lg font-semibold text-seylan-charcoal">
          Expense Breakdown
        </h3>
        <div className="space-y-3">
          {entries.map(([category, amount]) => {
            const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
            const barWidth = maxVal > 0 ? (amount / maxVal) * 100 : 0;
            return (
              <div key={category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-seylan-charcoal capitalize">
                    {category.toLowerCase()}
                  </span>
                  <span className="text-muted-foreground">
                    {formatLKR(amount)} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-seylan-mist rounded-full overflow-hidden">
                  <div
                    className="h-full bg-seylan-red rounded-full transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
