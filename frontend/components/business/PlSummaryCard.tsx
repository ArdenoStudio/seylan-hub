"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLKR } from "@/lib/utils";
import { getPlSummary } from "@/lib/api";
import { PlSummary } from "@/types";

interface PlSummaryCardProps {
  userId: string;
}

export function PlSummaryCard({ userId }: PlSummaryCardProps) {
  const [data, setData] = useState<PlSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlSummary(userId)
      .then((res) => setData(res as PlSummary))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!data) return null;

  const marginDiff = data.margin_pct - data.previous_margin_pct;
  const isUp = marginDiff >= 0;

  return (
    <Card className="border-seylan-border bg-white/95 shadow-lg shadow-seylan-plum/5">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
              Profit & loss
            </p>
            <h3 className="font-heading text-lg font-semibold text-seylan-charcoal">
              This week
            </h3>
          </div>
          <div className="rounded-full bg-seylan-mist px-3 py-1 text-xs text-muted-foreground">
            {data.week_label}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-seylan-mist/70 p-4">
            <div className="text-xs text-muted-foreground">Revenue</div>
            <div className="text-xl font-semibold text-seylan-charcoal">
              {formatLKR(data.revenue_lkr)}
            </div>
          </div>
          <div className="rounded-2xl bg-red-50 p-4">
            <div className="text-xs text-muted-foreground">Expenses</div>
            <div className="text-xl font-semibold text-red-600">
              {formatLKR(data.expenses_lkr)}
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <div className="text-xs text-muted-foreground">Net</div>
            <div className="text-xl font-semibold text-emerald-600">
              {formatLKR(data.net_lkr)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-semibold text-seylan-charcoal">
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
