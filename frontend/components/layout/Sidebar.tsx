"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, CreditCard, Store, Sparkles, Activity, ExternalLink, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/profile",   label: "Profile",   icon: UserCircle },
  { href: "/wallet",    label: "Wallet",    icon: Wallet    },
  { href: "/assistant", label: "Seylan AI", icon: Sparkles  },
  { href: "/loans",     label: "Loans",     icon: CreditCard },
  { href: "/business",  label: "Business",  icon: Store     },
];

const STATUS_URL = "https://seylan-hub-status1.vercel.app/";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[linear-gradient(180deg,#721c24_0%,#4f1219_100%)] text-white shadow-2xl shadow-seylan-plum/20 md:flex">
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
            <Image
              src="/seylan-bank-logo.png"
              alt="Seylan Bank"
              width={172}
              height={80}
              className="h-9 w-auto"
              priority
            />
            <span className="rounded-full bg-seylan-red/10 px-2 py-1 text-sm font-bold tracking-wide text-seylan-red">
              Hub
            </span>
          </div>
        </div>

        <div className="border-b border-white/10 px-3 py-4">
          <Link href="/profile" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 transition-colors hover:bg-white/15">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-seylan-red to-[#4f1219] text-xs font-bold text-white">
              NF
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">Nimal Fernando</div>
              <div className="text-xs text-white/60 truncate">0640-0001254-001</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-white text-seylan-plum shadow-lg shadow-black/10"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                    isActive ? "bg-seylan-red text-white" : "bg-white/10"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status link pinned to bottom */}
        <div className="border-t border-white/10 px-3 py-4">
          <a
            href={STATUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-white/50 transition-all hover:bg-white/10 hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 transition-colors group-hover:bg-white/15">
              <Activity className="h-4 w-4" />
            </span>
            <span className="font-medium">System Status</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </a>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-3 bottom-3 z-30 flex rounded-3xl border border-seylan-border bg-white/95 p-1 shadow-2xl shadow-seylan-plum/15 backdrop-blur md:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center py-2 text-xs",
                isActive
                  ? "rounded-2xl bg-seylan-red text-white"
                  : "text-gray-500"
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
