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
    "Your repayments are on track — great discipline. With 12 payments remaining, you'll clear this loan by June 2027.\nConsider setting up a LankaPay JustPay standing order for the 1st of each month so payments never miss.\nBased on your current trajectory, you qualify for a top-up loan of up to LKR 200,000 at our current rate.",
  "SEY-USR-003":
    "You have one missed payment from April 2026. This has triggered a CRIB flag — acting now prevents it from affecting your credit profile.\nPay LKR 45,000 via SeylanPay before 20 May to clear the arrear.\nWe can also restructure your schedule to reduce monthly burden — speak to your relationship manager.",
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
    <Card className="border-seylan-border bg-white/95 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-seylan-red/10">
            <Bot className="h-4 w-4 text-seylan-red" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-seylan-charcoal">
            What this means
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
            stroke="#E31821"
            strokeWidth="2"
          />
          <polyline
            points="0,35 10,33 20,30 40,28 60,25 80,22 100,20 120,17 140,14 160,10 180,7 200,5"
            fill="url(#sparkGradient)"
            stroke="none"
          />
          <defs>
            <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E31821" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#E31821" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <p className="text-sm text-muted-foreground leading-7 whitespace-pre-wrap">
            {advice}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
