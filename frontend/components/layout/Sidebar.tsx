"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Bot, CreditCard, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSwitcher } from "./UserSwitcher";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const NAV_ITEMS = [
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/assistant", label: "Assistant", icon: Bot },
  { href: "/loans", label: "Loans", icon: CreditCard },
  { href: "/business", label: "Business", icon: Store },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-seylan-charcoal text-white fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm">
            <Image
              src="/seylan-bank-logo.png"
              alt="Seylan Bank"
              width={172}
              height={80}
              className="h-9 w-auto"
              priority
            />
            <span className="text-sm font-bold tracking-wide text-seylan-red">
              Hub
            </span>
          </div>
        </div>

        {user && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <div className="text-xs text-gray-400 mb-1">{user.personaCode}</div>
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-gray-400">{user.location}</div>
            <div className="mt-2">
              <UserSwitcher />
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "border-l-[3px] border-seylan-gold text-seylan-gold bg-sidebar-accent"
                    : "text-gray-300 hover:bg-sidebar-accent hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-seylan-border flex">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center py-2 text-xs",
                isActive ? "text-seylan-red" : "text-gray-500"
              )}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
