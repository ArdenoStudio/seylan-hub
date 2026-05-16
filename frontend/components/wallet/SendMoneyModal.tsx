"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatLKR } from "@/lib/utils";
import {
  createPaymentSession,
  getSandboxTransferAccounts,
  postWalletTransfer,
} from "@/lib/api";
import { GBP_LKR_RATE, gbpToLkr } from "@/lib/remittance-fx";
import { toast } from "sonner";
import { EXTERNAL_LINK_REL, SEYLAN_LINKS } from "@/lib/seylan-external-links";
import { ArrowRight, CreditCard, Zap, Send, ChevronRight } from "lucide-react";
import { VerificationCard } from "@/components/ui/verification-card";

interface SendMoneyModalProps {
  senderId: string;
  recipientId: string;
  recipientAccountHolder: string;
  allocations: Record<string, number>;
  onSuccess: (amountLkr?: number, amountGbp?: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BUCKET_COLORS: Record<string, string> = {
  school: "#E0AF49",
  household: "#E31821",
  savings: "#10B981",
};

function getBucketColor(id: string): string {
  const key = id.toLowerCase().replace(/_/g, "");
  for (const [k, v] of Object.entries(BUCKET_COLORS)) {
    if (key.includes(k)) return v;
  }
  return "#8B5CF6";
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
      .then((data) => { if (!cancelled) setSandboxRouting(data); })
      .catch(() => { if (!cancelled) setSandboxRouting(null); })
      .finally(() => { if (!cancelled) setSandboxRoutingLoaded(true); });
    return () => { cancelled = true; };
  }, [open]);

  const hubRecipientLine = recipientAccountHolder.trim()
    ? `${recipientAccountHolder.trim()} · ${recipientId}`
    : recipientId;

  function buildSuccessToastDescription(): string {
    const lines: string[] = [`Hub wallet: ${hubRecipientLine}`];
    if (sandboxRouting) {
      lines.push(`Sandbox: ${sandboxRouting.source_account} → ${sandboxRouting.destination_account}`);
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
        // eslint-disable-next-line react-hooks/immutability -- external MPGS redirect
        window.location.href = session.checkout_url;
        return;
      }
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
            ? "Card payments are not yet activated. Use Demo Mode to test."
            : "Could not create payment session. Please try again."
          : "Transfer failed. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  const isValid = Number.isFinite(amountGbp) && amountGbp > 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="max-w-sm overflow-hidden border-0 p-0 shadow-2xl [background:linear-gradient(160deg,#2d0d12_0%,#1a0608_60%,#0f0305_100%)] [box-shadow:0_32px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]"
        showCloseButton={false}
      >
        {/* Top accent bar */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0AF49]/60 to-transparent" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-[#E31821]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-0">
          {/* Header */}
          <DialogHeader className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#E0AF49]/70">
                  Seylan Hub
                </p>
                <DialogTitle className="font-heading text-lg font-semibold text-white">
                  Send to Sri Lanka
                </DialogTitle>
              </div>
              <button
                type="button"
                onClick={() => handleDialogOpenChange(false)}
                className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-white/70"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-3 px-5 pb-5">
            {/* Mode toggle */}
            <div className="flex rounded-xl border border-white/8 bg-white/4 p-1">
              {(["card", "demo"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className="relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all"
                >
                  {paymentMode === mode && (
                    <motion.div
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-lg bg-[#721C24] shadow-[0_2px_12px_rgba(114,28,36,0.5)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative flex items-center gap-1.5 ${paymentMode === mode ? "text-white" : "text-white/40"}`}>
                    {mode === "card" ? <CreditCard className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                    {mode === "card" ? "Card (MPGS)" : "Demo Mode"}
                  </span>
                </button>
              ))}
            </div>

            {/* Recipient card */}
            <VerificationCard
              backgroundImage="https://images.unsplash.com/photo-1566837945700-30057527ade0?w=640&q=80"
              label="Seylan Hub · Recipient"
              idNumber={recipientId}
              name={recipientAccountHolder.trim() || "Hub Wallet"}
              validThru="GBP→LKR"
            />

            {/* Sandbox routing (shown below card when available) */}
            {sandboxRoutingLoaded && sandboxRouting && (
              <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 py-2 font-mono text-[11px] text-white/40">
                <span className="truncate">{sandboxRouting.source_account}</span>
                <ArrowRight className="h-3 w-3 shrink-0 text-[#E0AF49]/50" />
                <span className="truncate">{sandboxRouting.destination_account}</span>
              </div>
            )}

            {/* Amount input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                <span className="text-sm font-bold text-white/30">£</span>
              </div>
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
                className="border-white/10 bg-white/5 pl-8 text-sm font-semibold text-white placeholder:text-white/20 focus-visible:border-[#E0AF49]/40 focus-visible:ring-[#E0AF49]/20"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
                <span className="text-xs font-medium text-white/30">GBP</span>
              </div>
            </div>

            {/* LKR conversion */}
            <div className="relative overflow-hidden rounded-xl border border-[#E0AF49]/20 bg-gradient-to-br from-[#E0AF49]/8 to-transparent p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#E0AF49]/60">
                    You send
                  </p>
                  <p className="font-heading text-2xl font-bold tracking-tight text-[#E0AF49]">
                    {formatLKR(amountLkr)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/30">Rate</p>
                  <p className="font-mono text-xs font-semibold text-white/50">
                    {GBP_LKR_RATE}
                  </p>
                </div>
              </div>
            </div>

            {/* Allocation */}
            <div className="rounded-xl border border-white/8 bg-white/4 p-3.5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Allocation
              </p>
              <div className="space-y-2.5">
                {Object.entries(allocations).map(([id, pct]) => {
                  const color = getBucketColor(id);
                  return (
                    <div key={id}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium capitalize text-white/70">
                          {id.replace(/_/g, " ")}
                        </span>
                        <span className="font-mono text-xs font-semibold text-white/50">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footnote */}
            <AnimatePresence mode="wait">
              <motion.p
                key={paymentMode}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] leading-relaxed text-white/30"
              >
                {paymentMode === "card" ? (
                  <>
                    Test card:{" "}
                    <span className="font-mono font-semibold text-white/50">5123 4500 0000 0008</span>
                    {" "}· exp{" "}
                    <span className="font-mono font-semibold text-white/50">01/39</span>
                    {" "}· CVV{" "}
                    <span className="font-mono font-semibold text-white/50">100</span>
                    . Real cards not accepted.
                  </>
                ) : (
                  <>
                    Simulates transfer internally. Live payouts via{" "}
                    <a
                      href={SEYLAN_LINKS.internetBankingPersonalLogin}
                      target="_blank"
                      rel={EXTERNAL_LINK_REL}
                      className="font-medium text-[#E0AF49]/70 underline-offset-2 hover:text-[#E0AF49] hover:underline"
                    >
                      Personal Internet Banking
                    </a>
                    .
                  </>
                )}
              </motion.p>
            </AnimatePresence>

            {/* CTA */}
            <button
              type="button"
              disabled={sending || !isValid}
              onClick={handleSubmit}
              className="group relative w-full overflow-hidden rounded-xl bg-[#E31821] py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(227,24,33,0.4)] transition-all hover:bg-[#c41219] hover:shadow-[0_6px_28px_rgba(227,24,33,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              <span className="relative flex items-center justify-center gap-2">
                {sending ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {paymentMode === "card" ? "Redirecting…" : "Sending…"}
                  </>
                ) : (
                  <>
                    {paymentMode === "card" ? <CreditCard className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                    {paymentMode === "card"
                      ? `Pay ${formatLKR(amountLkr)} by Card`
                      : `Send ${formatLKR(amountLkr)}`}
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
