"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";

interface AIAdvisorPanelProps {
  userId: string;
}

export function AIAdvisorPanel({ userId }: AIAdvisorPanelProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
    fetch(`${apiBase}/api/loans/advisor?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setAdvice(data.advice ?? data.text ?? JSON.stringify(data)))
      .catch(() => setAdvice("Unable to load advisor recommendations."))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Card className="border-seylan-border">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-4 w-4 text-seylan-red" />
          <h3 className="text-sm font-medium text-seylan-charcoal">
            AI Advisor
          </h3>
        </div>

        {/* Sparkline SVG */}
        <svg
          viewBox="0 0 200 40"
          className="w-full h-10 mb-3"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,35 10,33 20,30 40,28 60,25 80,22 100,20 120,17 140,14 160,10 180,7 200,5"
            fill="none"
            stroke="#C8102E"
            strokeWidth="2"
          />
          <polyline
            points="0,35 10,33 20,30 40,28 60,25 80,22 100,20 120,17 140,14 160,10 180,7 200,5"
            fill="url(#sparkGradient)"
            stroke="none"
          />
          <defs>
            <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#C8102E" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C8102E" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {advice}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
