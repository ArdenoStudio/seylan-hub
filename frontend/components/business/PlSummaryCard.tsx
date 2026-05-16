"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ErrorState";
import { formatLKR } from "@/lib/utils";
import { getPlSummary } from "@/lib/api";
import { PlSummary } from "@/types";

interface PlSummaryCardProps {
  userId: string;
}

export function PlSummaryCard({ userId }: PlSummaryCardProps) {
  const [data, setData] = useState<PlSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getPlSummary(userId)
      .then((res) => setData(res as PlSummary))
      .catch((err) => {
        setData(null);
        setError(err instanceof Error ? err.message : "Failed to load P&L");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton className="h-48 w-full" />;
  if (error && !data) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const marginDiff = data.margin_pct - data.previous_margin_pct;
  const isUp = marginDiff >= 0;

  return (
    <Card className="border-seylan-border">
      <CardContent className="p-5">
        <div className="text-xs text-muted-foreground mb-2">
          {data.week_label}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Revenue</div>
            <div className="text-lg font-bold text-seylan-charcoal">
              {formatLKR(data.revenue_lkr)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Expenses</div>
            <div className="text-lg font-bold text-red-600">
              {formatLKR(data.expenses_lkr)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Net</div>
            <div className="text-lg font-bold text-emerald-600">
              {formatLKR(data.net_lkr)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-seylan-charcoal">
            {data.margin_pct}%
          </span>
          <span className={`text-sm ${isUp ? "text-emerald-600" : "text-red-600"}`}>
            {isUp ? "↑" : "↓"} {Math.abs(marginDiff).toFixed(1)}pp
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Last week: {data.previous_margin_pct}%
        </div>
      </CardContent>
    </Card>
  );
}
