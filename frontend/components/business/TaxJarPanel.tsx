"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatLKR } from "@/lib/utils";
import { createPaymentSession } from "@/lib/api";
import { toast } from "sonner";
import { Transaction } from "@/types";
import { CreditCard, Loader2 } from "lucide-react";

interface TaxJarPanelProps {
  userId: string;
  initialBalance: number;
  onNewTransaction?: (tx: Transaction) => void;
}

export function TaxJarPanel({
  userId,
  initialBalance,
}: TaxJarPanelProps) {
  const [displayBalance, setDisplayBalance] = useState(initialBalance);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardAmount, setCardAmount] = useState(8200);
  const [submitting, setSubmitting] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (displayBalance === initialBalance) return;
    const diff = initialBalance - displayBalance;
    const steps = 30;
    const increment = diff / steps;
    let current = displayBalance;
    let step = 0;

    animRef.current = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayBalance(initialBalance);
        clearInterval(animRef.current);
      } else {
        setDisplayBalance(Math.round(current));
      }
    }, 800 / steps);

    return () => clearInterval(animRef.current);
  }, [initialBalance, displayBalance]);

  async function handleCardPayment() {
    if (!cardAmount || cardAmount <= 0) return;
    setSubmitting(true);
    try {
      const session = await createPaymentSession({
        amount_lkr: cardAmount,
        purpose: "tax_jar_inbound",
        description: "Customer payment — Silva Hardware",
        metadata: { user_id: userId, tax_rate_pct: 10 },
      });
      window.location.href = session.checkout_url;
    } catch {
      toast.error("Could not create payment session. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
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
          className="w-full rounded-full bg-seylan-red hover:bg-seylan-red/90 text-white font-semibold"
          onClick={() => setCardModalOpen(true)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Accept Card Payment
        </Button>
      </CardContent>
    </Card>

    <Dialog open={cardModalOpen} onOpenChange={(o) => { if (!o) setCardModalOpen(false); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Card Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="rounded-lg bg-seylan-mist/60 border border-seylan-border p-3 text-sm">
            <p className="font-medium text-seylan-charcoal">Silva Hardware &amp; Electricals</p>
            <p className="text-xs text-muted-foreground mt-0.5">10% auto-saved to Tax Jar on receipt</p>
          </div>
          <div>
            <Label htmlFor="card-amount">Amount (LKR)</Label>
            <Input
              id="card-amount"
              type="number"
              min={1}
              step={100}
              value={Number.isFinite(cardAmount) ? cardAmount : ""}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setCardAmount(Number.isFinite(v) && v > 0 ? v : 0);
              }}
              className="mt-1"
            />
            {cardAmount > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Tax Jar will receive:{" "}
                <span className="font-semibold text-seylan-charcoal">
                  {formatLKR(Math.round(cardAmount * 0.1))}
                </span>
              </p>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Test card:{" "}
            <span className="font-mono font-semibold text-seylan-charcoal">5123 4500 0000 0008</span>
            , any future expiry, any CVV.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setCardModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-seylan-red hover:bg-seylan-red/90 text-white"
              disabled={submitting || !cardAmount || cardAmount <= 0}
              onClick={handleCardPayment}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {submitting ? "Redirecting..." : `Charge ${formatLKR(cardAmount)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
