"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, CreditCard, Home, Store } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DEMO_USERS } from "@/lib/demo-users";

const PERSONA_CARDS = [
  {
    user: DEMO_USERS[0],
    icon: Globe,
    title: "Diaspora Sender",
    description: "Send money home and track how it's spent in real time",
  },
  {
    user: DEMO_USERS[2],
    icon: CreditCard,
    title: "Borrower",
    description: "See your loan health and know exactly where you stand",
  },
  {
    user: DEMO_USERS[1],
    icon: Home,
    title: "Family Member",
    description: "Manage household finances with an AI assistant",
  },
  {
    user: DEMO_USERS[3],
    icon: Store,
    title: "Business Owner",
    description: "Simple bookkeeping and automatic tax savings",
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[920px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-seylan-red mb-4">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-bold text-seylan-charcoal">
            Welcome to Seylan Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose your persona to explore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERSONA_CARDS.map((card) => (
            <Card
              key={card.user.id}
              className="cursor-pointer border-seylan-border hover:border-seylan-red/50 hover:shadow-md transition-all"
              onClick={() =>
                handleSelect(card.user.id, card.user.defaultRoute)
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-seylan-red/10">
                    <card.icon className="h-5 w-5 text-seylan-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-seylan-charcoal">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {card.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {card.user.name} &middot; {card.user.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
