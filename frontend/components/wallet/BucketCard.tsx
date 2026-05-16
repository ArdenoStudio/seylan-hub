"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Home, PiggyBank } from "lucide-react";
import { Bucket } from "@/types";
import { formatLKR } from "@/lib/utils";

const ICON_MAP = {
  school: GraduationCap,
  household: Home,
  savings: PiggyBank,
};

const COLOUR_MAP: Record<string, { surface: string; icon: string; bar: string }> = {
  school: {
    surface: "bg-blue-50",
    icon: "text-blue-600",
    bar: "bg-blue-500",
  },
  household: {
    surface: "bg-emerald-50",
    icon: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  savings: {
    surface: "bg-violet-50",
    icon: "text-violet-600",
    bar: "bg-violet-500",
  },
};

const FALLBACK_COLOUR = { surface: "bg-slate-50", icon: "text-slate-600", bar: "bg-slate-500" };

interface BucketCardProps {
  bucket: Bucket;
  onClick?: () => void;
}

export function BucketCard({ bucket, onClick }: BucketCardProps) {
  const Icon = ICON_MAP[bucket.icon] ?? PiggyBank;
  const colours = COLOUR_MAP[bucket.icon] ?? FALLBACK_COLOUR;
  const spentPct =
    bucket.balance_lkr + bucket.spent_lkr > 0
      ? (bucket.spent_lkr / (bucket.balance_lkr + bucket.spent_lkr)) * 100
      : 0;

  return (
    <Card
      className="cursor-pointer card-glass shadow-brand border-0 transition-all hover:-translate-y-0.5 hover:shadow-brand-lg"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`rounded-2xl p-2.5 ${colours.surface}`}>
            <Icon className={`h-5 w-5 ${colours.icon}`} />
          </div>
          <div>
            <span className="text-sm font-semibold text-seylan-charcoal">
              {bucket.label}
            </span>
            <p className="text-xs text-muted-foreground">
              {bucket.allocation_pct}% of each remittance
            </p>
          </div>
        </div>

        <div className="text-3xl font-semibold text-seylan-charcoal mb-3">
          {formatLKR(bucket.balance_lkr)}
        </div>

        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-seylan-mist">
            <div
              className={`h-full rounded-full ${colours.bar}`}
              style={{ width: `${Math.min(spentPct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(spentPct)}% used</span>
            <span>Spent {formatLKR(bucket.spent_lkr)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
