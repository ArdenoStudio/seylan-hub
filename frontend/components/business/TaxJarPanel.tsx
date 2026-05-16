"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatLKR } from "@/lib/utils";
import { postTaxJarTrigger } from "@/lib/api";
import { toast } from "sonner";
import { Transaction } from "@/types";
import { Loader2 } from "lucide-react";

interface TaxJarPanelProps {
  userId: string;
  initialBalance: number;
  onNewTransaction?: (tx: Transaction) => void;
}

export function TaxJarPanel({
  userId,
  initialBalance,
  onNewTransaction,
}: TaxJarPanelProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [displayBalance, setDisplayBalance] = useState(initialBalance);
  const [triggering, setTriggering] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval>>(undefined);

  if (balance !== initialBalance && displayBalance === balance) {
    setBalance(initialBalance);
    setDisplayBalance(initialBalance);
  }

  useEffect(() => {
    if (displayBalance === balance) return;
    const diff = balance - displayBalance;
    const steps = 30;
    const increment = diff / steps;
    let current = displayBalance;
    let step = 0;

    animRef.current = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayBalance(balance);
        clearInterval(animRef.current);
      } else {
        setDisplayBalance(Math.round(current));
      }
    }, 800 / steps);

    return () => clearInterval(animRef.current);
  }, [balance, displayBalance]);

  async function handleTrigger() {
    setTriggering(true);
    try {
      const result = (await postTaxJarTrigger({
        user_id: userId,
        incoming_amount_lkr: 8200,
        description: "Cash Sale — Electrical Fittings",
      })) as { new_balance: number };

      const newBalance = result.new_balance ?? balance + 820;
      setBalance(newBalance);

      toast("LKR 8,200 received — LKR 820 auto-saved to Tax Jar", {
        icon: "🔔",
      });

      if (onNewTransaction) {
        onNewTransaction({
          transaction_id: crypto.randomUUID(),
          account_id: userId,
          amount_lkr: 8200,
          merchant: "Cash Sale — Electrical Fittings",
          category_en: "INCOME",
          category_si: "ආදායම",
          timestamp: new Date().toISOString(),
          type: "credit",
          description: "Cash Sale — Electrical Fittings",
        });
      }
    } catch {
      toast.error("Failed to trigger payment simulation.");
    } finally {
      setTriggering(false);
    }
  }

  return (
    <Card className="border-seylan-border bg-[linear-gradient(135deg,#fffdf8_0%,#fff0d5_100%)] shadow-lg shadow-seylan-gold/10">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
              Auto-save rule
            </p>
            <h3 className="font-heading text-xl font-semibold text-seylan-charcoal">
              Tax Jar
            </h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            ACTIVE
          </span>
        </div>

        <div className="text-4xl font-semibold text-seylan-charcoal mb-1">
          {formatLKR(displayBalance)}
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Rule: 10% of every incoming payment
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full w-3/5 rounded-full bg-seylan-gold" />
        </div>

        <Button
          className="w-full rounded-full"
          onClick={handleTrigger}
          disabled={triggering}
        >
          {triggering ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Simulate Incoming Payment LKR 8,200
        </Button>
      </CardContent>
    </Card>
  );
}
