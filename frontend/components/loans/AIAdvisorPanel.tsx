"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";

interface AIAdvisorPanelProps {
  userId: string;
}

const MOCK_ADVICE: Record<string, string> = {
  "SEY-USR-001":
    "Great progress, Nimal! You've completed 66% of your loan (24/36 payments). At your current pace, you'll be debt-free by May 2027. If you make one extra payment of LKR 20,000 this quarter, you could save LKR 18,400 in interest and finish 2 months early.",
  "SEY-USR-003":
    "Sunil, your loan health is AT_RISK because of the missed payment in April. To recover: (1) Make your May 20 payment on time — it's in 4 days. (2) Contact the branch to discuss a catch-up plan for the missed LKR 45,000. (3) Consider reducing non-essential expenses by LKR 5,000/month to build a buffer. Your health score can return to ON_TRACK within 3 months of consistent payments.",
};

export function AIAdvisorPanel({ userId }: AIAdvisorPanelProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

    if (useMock) {
      setTimeout(() => {
        if (!cancelled) {
          setAdvice(MOCK_ADVICE[userId] ?? MOCK_ADVICE["SEY-USR-001"]);
          setLoading(false);
        }
      }, 400);
      return () => { cancelled = true; };
    }

    fetch(`${apiBase}/api/loans/advisor?user_id=${userId}`, {
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setAdvice(data.advice ?? data.text ?? JSON.stringify(data));
      })
      .catch(() => {
        if (!cancelled) setAdvice(MOCK_ADVICE[userId] ?? MOCK_ADVICE["SEY-USR-001"]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
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
