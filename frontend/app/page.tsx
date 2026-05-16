"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, CreditCard, Home, Store, ArrowRight, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DEMO_USERS } from "@/lib/demo-users";

const PERSONA_CARDS = [
  {
    user: DEMO_USERS[0],
    icon: Globe,
    title: "Diaspora Sender",
    description: "Send money home and track how it's spent in real time",
    outcome: "Know every rupee is used with care",
  },
  {
    user: DEMO_USERS[2],
    icon: CreditCard,
    title: "Borrower",
    description: "See your loan health and know exactly where you stand",
    outcome: "Reduce repayment anxiety",
  },
  {
    user: DEMO_USERS[1],
    icon: Home,
    title: "Family Member",
    description: "Manage household finances with an AI assistant",
    outcome: "Get help in English or Sinhala",
  },
  {
    user: DEMO_USERS[3],
    icon: Store,
    title: "Business Owner",
    description: "Simple bookkeeping and automatic tax savings",
    outcome: "Keep tax money ready automatically",
  },
];

export default function OnboardingPage() {
  const { switchUser } = useCurrentUser();
  const router = useRouter();

  function handleSelect(userId: string, route: string) {
    switchUser(userId);
    router.push(route);
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center">
        <div className="mb-8 overflow-hidden rounded-[2.25rem] border border-seylan-border bg-[linear-gradient(135deg,#fffdf8_0%,#fff0db_52%,#ffd7bd_100%)] p-6 text-center shadow-[0_28px_100px_rgba(114,28,36,0.12)] sm:p-10">
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
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Choose a guided demo path and see how Seylan Hub turns banking data
            into simple next steps.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => handleSelect("SEY-USR-001", "/wallet")}
              className="rounded-full px-6"
            >
              Start with Family Wallet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <button
              onClick={() => handleSelect("SEY-BIZ-001", "/business")}
              className="text-sm font-medium text-seylan-charcoal underline-offset-4 hover:text-seylan-red hover:underline"
            >
              Or explore business banking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERSONA_CARDS.map((card) => (
            <Card
              key={card.user.id}
              className="group cursor-pointer border-seylan-border bg-white/90 shadow-sm transition-all hover:-translate-y-1 hover:border-seylan-red/40 hover:shadow-xl hover:shadow-seylan-plum/10"
              onClick={() =>
                handleSelect(card.user.id, card.user.defaultRoute)
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-seylan-red/10 transition-colors group-hover:bg-seylan-red group-hover:text-white">
                    <card.icon className="h-5 w-5 text-seylan-red transition-colors group-hover:text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-seylan-mist px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-seylan-plum">
                        {card.user.personaCode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {card.user.name} &middot; {card.user.location}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-seylan-charcoal">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {card.description}
                    </p>
                    <p className="mt-3 text-sm font-medium text-seylan-red">
                      {card.outcome}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs font-medium text-muted-foreground sm:grid-cols-4">
          {[
            "Real-time wallet",
            "Sinhala + English AI",
            "Loan health clarity",
            "Auto tax savings",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-seylan-border bg-white/70 px-3 py-2"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => handleSelect("SEY-USR-001", "/wallet")}
            className="text-sm text-muted-foreground hover:text-seylan-red transition-colors underline"
          >
            Skip — view as Nimal Fernando
          </button>
        </div>
      </div>
    </div>
  );
}
