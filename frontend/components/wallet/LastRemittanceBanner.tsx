"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatLKR } from "@/lib/utils";
import { WalletState } from "@/types";

interface LastRemittanceBannerProps {
  wallet: WalletState;
  onSendAgain: () => void;
}

export function LastRemittanceBanner({
  wallet,
  onSendAgain,
}: LastRemittanceBannerProps) {
  const { last_remittance } = wallet;

  return (
    <Card className="card-glass shadow-brand border-0">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
              Last remittance
            </div>
            <div className="mt-1 text-3xl font-semibold text-seylan-charcoal">
              {formatLKR(last_remittance.amount_lkr)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Sent {last_remittance.date} &middot; GBP{" "}
              {last_remittance.amount_gbp} at {last_remittance.fx_rate} &middot;
              via {last_remittance.provider}
            </div>
          </div>
          <Button className="rounded-full" size="sm" onClick={onSendAgain}>
            Send Again
          </Button>
        </div>

        <div className="mt-4 rounded-2xl border border-seylan-border bg-seylan-mist/60 px-3 py-2">
          <span className="text-xs text-muted-foreground">
            GBP→LKR @ {last_remittance.fx_rate} today{" "}
            <span className="text-emerald-600">↑ 0.4% this week</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
