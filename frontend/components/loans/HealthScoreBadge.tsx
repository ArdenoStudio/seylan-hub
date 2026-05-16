"use client";

import { HealthScore } from "@/types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface HealthScoreBadgeProps {
  score: HealthScore;
}

const CONFIG = {
  ON_TRACK: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "On Track",
    Icon: CheckCircle,
  },
  AT_RISK: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "At Risk",
    Icon: AlertTriangle,
  },
  CRITICAL: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Critical",
    Icon: XCircle,
  },
};

export function HealthScoreBadge({ score }: HealthScoreBadgeProps) {
  const { bg, text, label, Icon } = CONFIG[score];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
