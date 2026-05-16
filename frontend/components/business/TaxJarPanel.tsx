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
    <Card className="border-seylan-border">
      <CardContent className="p-5">
        <h3 className="text-sm font-medium text-seylan-charcoal mb-3">
          Tax Jar
        </h3>

        <div className="text-3xl font-bold text-seylan-charcoal mb-1">
          {formatLKR(displayBalance)}
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Rule: 10% of every incoming payment
        </div>

        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 mb-4">
          ACTIVE
        </span>

        <Button
          className="w-full"
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
