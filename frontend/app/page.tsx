"use client";

import Image from "next/image";
import Link from "next/link";
import { Wallet, Bot, CreditCard, Store, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MODULES = [
  {
    href: "/wallet",
    icon: Wallet,
    label: "Family Wallet",
    description: "Track remittances and control how each rupee is spent across buckets.",
  },
  {
    href: "/assistant",
    icon: Bot,
    label: "AI Assistant",
    description: "Ask anything in English or Sinhala — balances, loans, transactions.",
  },
  {
    href: "/loans",
    icon: CreditCard,
    label: "Loan Dashboard",
    description: "See your repayment health, next due date, and an AI advisor summary.",
  },
  {
    href: "/business",
    icon: Store,
    label: "Business Bookkeeper",
    description: "Weekly P&L, AI-categorised transactions, and automatic tax savings.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center gap-8">

        {/* Hero */}
        <div className="overflow-hidden rounded-[2.25rem] border border-seylan-border bg-[linear-gradient(135deg,#fffdf8_0%,#fff0db_52%,#ffd7bd_100%)] p-6 text-center shadow-[0_28px_100px_rgba(114,28,36,0.12)] sm:p-10">
          <div className="mx-auto mb-5 inline-flex rounded-2xl border border-seylan-border bg-white px-5 py-3 shadow-sm">
            <Image
              src="/seylan-bank-logo.png"
              alt="Seylan Bank"
              width={215}
              height={100}
              className="h-12 w-auto"
              priority
            />
          </div>
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-seylan-red/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-seylan-red">
            <ShieldCheck className="h-3.5 w-3.5" />
            AI banking for Sri Lanka
          </div>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-semibold leading-tight text-seylan-charcoal sm:text-6xl">
            Money clarity for families, borrowers, and small businesses.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Real-time Seylan Bank data. Bilingual AI. Four modules built for how Sri Lankans actually use money.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/wallet">
                Open Seylan Hub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MODULES.map((mod) => (
            <Card
              key={mod.href}
              className="group cursor-pointer card-glass shadow-brand border-0 transition-all hover:-translate-y-1 hover:shadow-brand-lg"
            >
              <Link href={mod.href}>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-seylan-red/10 transition-colors group-hover:bg-seylan-red">
                    <mod.icon className="h-5 w-5 text-seylan-red transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-seylan-charcoal">
                      {mod.label}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-xs font-medium text-muted-foreground sm:grid-cols-4">
          {["Real-time wallet", "Sinhala + English AI", "Loan health clarity", "Auto tax savings"].map(
            (item) => (
              <div key={item} className="rounded-full border border-seylan-border bg-white/70 px-3 py-2">
                {item}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}