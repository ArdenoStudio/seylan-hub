"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Home, PiggyBank } from "lucide-react";
import { Bucket } from "@/types";
import { formatLKR } from "@/lib/utils";

const ICON_MAP = {
  school: GraduationCap,
  household: Home,
  savings: PiggyBank,
};

const COLOUR_MAP = {
  school: "bg-blue-500",
  household: "bg-emerald-500",
  savings: "bg-violet-500",
};

interface BucketCardProps {
  bucket: Bucket;
  onClick?: () => void;
}

export function BucketCard({ bucket, onClick }: BucketCardProps) {
  const Icon = ICON_MAP[bucket.icon];
  const progressColour = COLOUR_MAP[bucket.icon];
  const spentPct =
    bucket.balance_lkr + bucket.spent_lkr > 0
      ? (bucket.spent_lkr / (bucket.balance_lkr + bucket.spent_lkr)) * 100
      : 0;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow border-seylan-border"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${progressColour}/10`}>
            <Icon className={`h-5 w-5 text-${bucket.icon === "school" ? "blue" : bucket.icon === "household" ? "emerald" : "violet"}-500`} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {bucket.label}
          </span>
        </div>

        <div className="text-2xl font-bold text-seylan-charcoal mb-3">
          {formatLKR(bucket.balance_lkr)}
        </div>

        <div className="space-y-2">
          <Progress value={spentPct} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{bucket.allocation_pct}% allocation</span>
            <span>Spent {formatLKR(bucket.spent_lkr)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
