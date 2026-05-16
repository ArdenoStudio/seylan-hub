"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLKR } from "@/lib/utils";
import { postWalletTransfer } from "@/lib/api";
import { toast } from "sonner";
import { Send } from "lucide-react";

const FX_RATE = 408.3;

interface SendMoneyModalProps {
  senderId: string;
  recipientId: string;
  allocations: Record<string, number>;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendMoneyModal({
  senderId,
  recipientId,
  allocations,
  onSuccess,
  open,
  onOpenChange,
}: SendMoneyModalProps) {
  const [amountGbp, setAmountGbp] = useState(600);
  const [sending, setSending] = useState(false);

  const amountLkr = Math.round(amountGbp * FX_RATE);

  async function handleSubmit() {
    setSending(true);
    try {
      await postWalletTransfer({
        sender_account_id: senderId,
        recipient_account_id: recipientId,
        amount_lkr: amountLkr,
        corridor: "GBP->LKR",
        allocation_rules: allocations,
      });
      toast.success(`Sent ${formatLKR(amountLkr)} to Kumari`);
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Transfer failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="fixed bottom-20 right-6 md:bottom-6 z-20">
        <Button size="lg" className="rounded-full shadow-lg gap-2">
          <Send className="h-4 w-4" />
          Send Money
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Money to Sri Lanka</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="amount">Amount (GBP)</Label>
            <Input
              id="amount"
              type="number"
              value={amountGbp}
              onChange={(e) => setAmountGbp(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="p-3 bg-seylan-mist rounded-lg">
            <div className="text-sm text-muted-foreground">
              LKR conversion at {FX_RATE}
            </div>
            <div className="text-xl font-bold text-seylan-charcoal">
              {formatLKR(amountLkr)}
            </div>
          </div>
          <div className="p-3 bg-seylan-mist rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">
              Allocation
            </div>
            {Object.entries(allocations).map(([id, pct]) => (
              <div
                key={id}
                className="flex justify-between text-sm text-seylan-charcoal"
              >
                <span className="capitalize">{id.replace(/_/g, " ")}</span>
                <span>{pct}%</span>
              </div>
            ))}
          </div>
          <Button
            className="w-full"
            disabled={sending || amountGbp <= 0}
            onClick={handleSubmit}
          >
            {sending ? "Sending..." : `Send ${formatLKR(amountLkr)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
