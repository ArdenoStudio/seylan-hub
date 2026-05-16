"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loan } from "@/types";
import { formatLKR } from "@/lib/utils";
import { createPaymentSession } from "@/lib/api";
import { toast } from "sonner";

interface LoanPaymentModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
}

export function LoanPaymentModal({ loan, isOpen, onClose }: LoanPaymentModalProps) {
  const [amount, setAmount] = useState(loan.monthly_payment_lkr);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!amount || amount <= 0) return;
    setSubmitting(true);
    try {
      const session = await createPaymentSession({
        amount_lkr: amount,
        purpose: "loan",
        description: "Loan instalment -- " + loan.loan_id,
        metadata: {
          loan_id: loan.loan_id,
          user_id: loan.user_id,
          installment_number: loan.payments_made + 1,
        },
      });
      window.location.href = session.checkout_url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      const isUnconfigured = msg.includes("[503]") || msg.includes("not enabled");
      toast.error(
        isUnconfigured
          ? "Card payments are not yet activated on this deployment."
          : "Could not create payment session. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make Loan Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Loan summary */}
          <div className="rounded-lg border border-seylan-border bg-seylan-mist/60 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loan</span>
              <span className="font-mono font-medium text-seylan-charcoal">{loan.loan_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Outstanding</span>
              <span className="font-semibold text-seylan-charcoal">{formatLKR(loan.outstanding_lkr)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly instalment</span>
              <span className="font-semibold text-seylan-charcoal">{formatLKR(loan.monthly_payment_lkr)}</span>
            </div>
          </div>

          {/* Amount editor */}
          <div>
            <Label htmlFor="loan-amount">Payment amount (LKR)</Label>
            <Input
              id="loan-amount"
              type="number"
              min={1}
              step={500}
              value={Number.isFinite(amount) ? amount : ""}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setAmount(Number.isFinite(v) && v > 0 ? v : 0);
              }}
              className="mt-1"
            />
            {amount > loan.outstanding_lkr && (
              <p className="mt-1 text-xs text-amber-600">
                Amount exceeds outstanding balance of {formatLKR(loan.outstanding_lkr)}.
              </p>
            )}
          </div>

          {/* Test card reminder */}
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Processed by Mastercard&apos;s secure gateway. Test card:{" "}
            <span className="font-mono font-semibold text-seylan-charcoal">5123 4500 0000 0008</span>
            , any future expiry, any 3-digit CVV.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-seylan-red hover:bg-seylan-red/90 text-white"
              disabled={submitting || !amount || amount <= 0}
              onClick={handleSubmit}
            >
              {submitting ? "Redirecting..." : "Pay " + formatLKR(amount)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}