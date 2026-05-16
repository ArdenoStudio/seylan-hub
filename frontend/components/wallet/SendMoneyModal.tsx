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
import {
  createPaymentSession,
  getSandboxTransferAccounts,
  postWalletTransfer,
} from "@/lib/api";
import { GBP_LKR_RATE, gbpToLkr } from "@/lib/remittance-fx";
import { toast } from "sonner";
import { EXTERNAL_LINK_REL, SEYLAN_LINKS } from "@/lib/seylan-external-links";

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
  const [paymentMode, setPaymentMode] = useState<"card" | "demo">("card");
  const [amountGbp, setAmountGbp] = useState(600);
  const [sending, setSending] = useState(false);
  const [sandboxRouting, setSandboxRouting] = useState<{
    source_account: string;
    destination_account: string;
  } | null>(null);
  const [sandboxRoutingLoaded, setSandboxRoutingLoaded] = useState(false);

  const amountLkr = gbpToLkr(amountGbp);

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
      if (paymentMode === "card") {
        const bucketAllocations = Object.entries(allocations).map(
          ([id, pct]) => ({ id, label: id.replace(/_/g, " "), pct })
        );
        const session = await createPaymentSession({
          amount_lkr: amountLkr,
          purpose: "remittance",
          description: `Remittance to ${recipientAccountHolder.trim() || recipientId}`,
          metadata: {
            account_id: "SEY-ACC-002",
            buckets: bucketAllocations,
            sender_amount_gbp: amountGbp,
            fx_rate: GBP_LKR_RATE,
          },
        });
        window.location.href = session.checkout_url;
        return;
      }

      // Demo mode — existing postWalletTransfer flow unchanged
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      const isUnconfigured = msg.includes("[503]") || msg.includes("not enabled");
      toast.error(
        paymentMode === "card"
          ? isUnconfigured
            ? "Card payments are not yet activated on this deployment. Use Demo Mode to test the transfer flow."
            : "Could not create payment session. Please try again."
          : "Transfer failed. Please try again."
      );
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
          {/* Payment mode toggle */}
          <div className="flex rounded-lg border border-seylan-border overflow-hidden text-sm font-medium">
            <button
              type="button"
              className={`flex-1 py-2 transition-colors ${
                paymentMode === "card"
                  ? "bg-seylan-plum text-white"
                  : "bg-white text-seylan-charcoal hover:bg-seylan-mist"
              }`}
              onClick={() => setPaymentMode("card")}
            >
              💳 Pay with Card (Real)
            </button>
            <button
              type="button"
              className={`flex-1 py-2 transition-colors ${
                paymentMode === "demo"
                  ? "bg-seylan-plum text-white"
                  : "bg-white text-seylan-charcoal hover:bg-seylan-mist"
              }`}
              onClick={() => setPaymentMode("demo")}
            >
              🎭 Demo Mode
            </button>
          </div>

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
              step="0.01"
              min={0.01}
              value={Number.isFinite(amountGbp) ? amountGbp : 0}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setAmountGbp(Number.isFinite(v) && v >= 0 ? v : 0);
              }}
            />
          </div>
          <div className="p-3 bg-seylan-mist rounded-lg">
            <div className="text-sm text-muted-foreground">
              LKR conversion at {GBP_LKR_RATE} (integer LKR = GBP × rate, rounded)
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
          {paymentMode === "card" ? (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Card payments are processed by Mastercard&apos;s secure gateway.
              This is test mode — use test card{" "}
              <span className="font-mono font-semibold text-seylan-charcoal">
                5123 4500 0000 0008
              </span>
              , any future expiry, any 3-digit CVV.
            </p>
          ) : (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Demo mode simulates the transfer internally. Live corridor payouts
              finalize in Seylan&apos;s authorised channels—for example{" "}
              <a
                href={SEYLAN_LINKS.internetBankingPersonalLogin}
                target="_blank"
                rel={EXTERNAL_LINK_REL}
                className="font-medium text-seylan-plum underline-offset-2 hover:text-seylan-red hover:underline"
              >
                Personal Internet Banking
              </a>{" "}
              or the Seylan Mobile Banking app.
            </p>
          )}
          <Button
            className="w-full"
            disabled={sending || !Number.isFinite(amountGbp) || amountGbp <= 0}
            onClick={handleSubmit}
          >
            {sending
              ? paymentMode === "card"
                ? "Redirecting to Mastercard..."
                : "Sending..."
              : paymentMode === "card"
              ? `Pay ${formatLKR(amountLkr)} by Card`
              : `Send ${formatLKR(amountLkr)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
