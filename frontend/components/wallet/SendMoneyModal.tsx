"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLKR } from "@/lib/utils";
import { getSandboxTransferAccounts, postWalletTransfer } from "@/lib/api";
import { toast } from "sonner";
import { EXTERNAL_LINK_REL, SEYLAN_LINKS } from "@/lib/seylan-external-links";

const FX_RATE = 408.3;

interface SendMoneyModalProps {
  senderId: string;
  recipientId: string;
  /** From wallet API (e.g. getFamilyWallet) — not hardcoded marketing copy */
  recipientAccountHolder: string;
  allocations: Record<string, number>;
  onSuccess: (amountLkr?: number, amountGbp?: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendMoneyModal({
  senderId,
  recipientId,
  recipientAccountHolder,
  allocations,
  onSuccess,
  open,
  onOpenChange,
}: SendMoneyModalProps) {
  const [amountGbp, setAmountGbp] = useState(600);
  const [sending, setSending] = useState(false);
  const [sandboxRouting, setSandboxRouting] = useState<{
    source_account: string;
    destination_account: string;
  } | null>(null);
  const [sandboxRoutingLoaded, setSandboxRoutingLoaded] = useState(false);

  const amountLkr = Math.round(amountGbp * FX_RATE);

  function handleDialogOpenChange(next: boolean) {
    if (!next) {
      setSandboxRouting(null);
      setSandboxRoutingLoaded(false);
    }
    onOpenChange(next);
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getSandboxTransferAccounts()
      .then((data) => {
        if (!cancelled) setSandboxRouting(data);
      })
      .catch(() => {
        if (!cancelled) setSandboxRouting(null);
      })
      .finally(() => {
        if (!cancelled) setSandboxRoutingLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const hubRecipientLine = recipientAccountHolder.trim()
    ? `${recipientAccountHolder.trim()} · ${recipientId}`
    : recipientId;

  function buildSuccessToastDescription(): string {
    const lines: string[] = [`Hub wallet: ${hubRecipientLine}`];
    if (sandboxRouting) {
      lines.push(
        `Sandbox internal transfer: ${sandboxRouting.source_account} → ${sandboxRouting.destination_account}`
      );
    }
    return lines.join("\n");
  }

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
      toast.success(`Sent ${formatLKR(amountLkr)}`, {
        description: buildSuccessToastDescription(),
      });
      handleDialogOpenChange(false);
      onSuccess(amountLkr, amountGbp);
    } catch {
      toast.error("Transfer failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Money to Sri Lanka</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="rounded-lg border border-seylan-border bg-white/80 p-3 text-xs space-y-2">
            <p className="font-semibold text-seylan-charcoal">Recipient (Seylan Hub)</p>
            <p className="text-muted-foreground break-words">
              {recipientAccountHolder.trim() ? (
                <>
                  <span className="text-seylan-charcoal">{recipientAccountHolder.trim()}</span>
                  <span className="text-muted-foreground"> · </span>
                </>
              ) : null}
              <span className="font-mono text-seylan-charcoal">{recipientId}</span>
            </p>
            <p className="font-semibold text-seylan-charcoal pt-1 border-t border-seylan-border/60 mt-2 pt-2">
              Sandbox internal transfer (when enabled)
            </p>
            {!sandboxRoutingLoaded ? (
              <p className="text-muted-foreground">Loading account numbers…</p>
            ) : sandboxRouting ? (
              <p className="font-mono text-muted-foreground break-all">
                {sandboxRouting.source_account} → {sandboxRouting.destination_account}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Could not load sandbox routing from the API. Transfers still update the Hub wallet when
                the request succeeds.
              </p>
            )}
          </div>

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
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Live corridor payouts, beneficiary onboarding, bank OTP flows, and
            mandate-driven debits finalize in Seylan&apos;s authorised channels—for
            example{" "}
            <a
              href={SEYLAN_LINKS.internetBankingPersonalLogin}
              target="_blank"
              rel={EXTERNAL_LINK_REL}
              className="font-medium text-seylan-plum underline-offset-2 hover:text-seylan-red hover:underline"
            >
              Personal Internet Banking
            </a>{" "}
            or the Seylan Mobile Banking app—unless your deployment has Seylan Hub
            gateway credentials configured.
          </p>
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
