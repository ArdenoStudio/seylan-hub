"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wallet, Bot, CreditCard, Store, ChevronDown, ExternalLink } from "lucide-react";

const MODULES = [
  {
    href: "/wallet",
    icon: Wallet,
    label: "Family Wallet",
    description: "Remittance buckets for expat families",
    color: "#E31821",
    bg: "bg-red-50",
  },
  {
    href: "/assistant",
    icon: Bot,
    label: "AI Assistant",
    description: "Bilingual chat — English & Sinhala",
    color: "#8B5CF6",
    bg: "bg-purple-50",
  },
  {
    href: "/loans",
    icon: CreditCard,
    label: "Loan Dashboard",
    description: "Repayment health & AI advisor",
    color: "#3B82F6",
    bg: "bg-blue-50",
  },
  {
    href: "/business",
    icon: Store,
    label: "Business Bookkeeper",
    description: "P&L and tax jar for Mudalali owners",
    color: "#10B981",
    bg: "bg-emerald-50",
  },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-seylan-border bg-seylan-mist/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/seylan-logo.svg"
              alt="Seylan Bank"
              width={80}
              height={24}
              className="h-6 w-auto"
              priority
            />
            <span className="rounded-md bg-seylan-red px-2 py-0.5 text-xs font-bold tracking-wide text-white">
              Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Modules dropdown */}
            <div className="relative">
              <button
                onClick={() => setModulesOpen((v) => !v)}
                onBlur={() => setTimeout(() => setModulesOpen(false), 150)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-seylan-charcoal/70 hover:text-seylan-charcoal hover:bg-seylan-border/40 transition-colors"
              >
                Modules
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${modulesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {modulesOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl border border-seylan-border bg-white shadow-lg shadow-seylan-charcoal/10 p-2">
                  {MODULES.map((mod) => (
                    <Link
                      key={mod.href}
                      href={mod.href}
                      className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-seylan-mist transition-colors group"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${mod.bg}`}
                      >
                        <mod.icon className="h-4 w-4" style={{ color: mod.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-seylan-charcoal group-hover:text-seylan-red transition-colors">
                          {mod.label}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug">
                          {mod.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="#about"
              className="rounded-lg px-3 py-2 text-sm font-medium text-seylan-charcoal/70 hover:text-seylan-charcoal hover:bg-seylan-border/40 transition-colors"
            >
              About
            </Link>
            <Link
              href="/status"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-seylan-charcoal/70 hover:text-seylan-charcoal hover:bg-seylan-border/40 transition-colors"
            >
              Status
              <ExternalLink className="h-3 w-3 opacity-50" />
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/wallet"
              className="inline-flex items-center gap-1.5 rounded-lg bg-seylan-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seylan-red/90 hover:-translate-y-px transition-all duration-150 group"
            >
              Open Hub
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex md:hidden items-center justify-center rounded-lg p-2 text-seylan-charcoal/70 hover:bg-seylan-border/40 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-seylan-border bg-white px-6 py-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 pb-1">
            Modules
          </p>
          {MODULES.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-seylan-mist transition-colors"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${mod.bg}`}
              >
                <mod.icon className="h-3.5 w-3.5" style={{ color: mod.color }} />
              </div>
              <span className="text-sm font-medium text-seylan-charcoal">{mod.label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-seylan-border mt-2">
            <Link
              href="/wallet"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-seylan-red px-4 py-2.5 text-sm font-semibold text-white"
            >
              Open Hub →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
