"use client";

import { useState } from "react";
import { Wallet, Bot, CreditCard, Store, Mic, CheckCircle, Zap } from "lucide-react";

const TABS = [
  { label: "Family Wallet", icon: Wallet, color: "#E31821", bg: "bg-red-50" },
  { label: "AI Assistant", icon: Bot, color: "#8B5CF6", bg: "bg-purple-50" },
  { label: "Loan Dashboard", icon: CreditCard, color: "#3B82F6", bg: "bg-blue-50" },
  { label: "Business Bookkeeper", icon: Store, color: "#10B981", bg: "bg-emerald-50" },
];

const URLS = [
  "seylanhub.app/wallet",
  "seylanhub.app/assistant",
  "seylanhub.app/loans",
  "seylanhub.app/business",
];

// ─── Panel: Wallet ───────────────────────────────────────────────────────────
function WalletPanel() {
  const buckets = [
    { label: "Education", pct: 45, color: "#E31821" },
    { label: "Food & Groceries", pct: 30, color: "#D9A441" },
    { label: "Savings", pct: 25, color: "#721C24" },
  ];
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Total Balance</p>
          <p className="text-2xl font-bold text-seylan-charcoal">LKR 124,500</p>
        </div>
        <div className="rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-semibold text-seylan-red">
          Live ↑
        </div>
      </div>
      <div className="space-y-2.5">
        {buckets.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-seylan-charcoal/80">{b.label}</span>
              <span className="font-semibold" style={{ color: b.color }}>{b.pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-seylan-border/60">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${b.pct}%`, backgroundColor: b.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-seylan-border bg-seylan-mist p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground font-medium">Last transfer</p>
          <p className="text-sm font-semibold text-seylan-charcoal">LKR 12,500 sent</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
          <CheckCircle className="h-3.5 w-3.5" /> Delivered
        </div>
      </div>
    </div>
  );
}

// ─── Panel: AI Assistant ─────────────────────────────────────────────────────
function AssistantPanel() {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
          <Bot className="h-3.5 w-3.5 text-purple-600" />
        </div>
        <span className="text-xs font-semibold text-seylan-charcoal/70">SeylanHub Assistant</span>
        <span className="ml-auto text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
          Groq · llama-3.3
        </span>
      </div>

      {/* User bubble */}
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-seylan-red px-3.5 py-2 text-sm text-white">
          What is my balance?
        </div>
      </div>

      {/* AI bubble */}
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-purple-50 border border-purple-100 px-3.5 py-2 text-sm text-seylan-charcoal">
          <p className="font-medium">ඔබේ ශේෂය රු. 124,500 ක් වේ</p>
          <p className="text-xs text-muted-foreground mt-0.5">Your balance is LKR 124,500</p>
        </div>
      </div>

      {/* User bubble */}
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-seylan-red px-3.5 py-2 text-sm text-white">
          ණය ගෙවීම කවදාද?
        </div>
      </div>

      {/* AI bubble */}
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-purple-50 border border-purple-100 px-3.5 py-2 text-sm text-seylan-charcoal">
          Next payment is due in <span className="font-semibold">14 days</span> — LKR 8,200
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 rounded-xl border border-seylan-border bg-white px-3 py-2 mt-2">
        <span className="flex-1 text-xs text-muted-foreground">Ask in English or Sinhala…</span>
        <Mic className="h-4 w-4 text-purple-400" />
      </div>
    </div>
  );
}

// ─── Panel: Loan Dashboard ───────────────────────────────────────────────────
function LoansPanel() {
  const score = 78;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-4">
        {/* SVG gauge */}
        <div className="relative flex items-center justify-center">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={r} fill="none" stroke="#EAD7C2" strokeWidth="8" />
            <circle
              cx="48" cy="48" r={r}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 48 48)"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-xl font-bold text-seylan-charcoal leading-none">{score}</p>
            <p className="text-[9px] text-muted-foreground font-medium">/ 100</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Health Score</p>
          <p className="text-sm font-bold text-blue-600">Good Standing</p>
          <p className="text-xs text-muted-foreground">Next due in 14 days</p>
        </div>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 space-y-1">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-blue-700">AI Advisor</span>
        </div>
        <p className="text-xs text-blue-600 leading-relaxed">
          On track — next payment of LKR 8,200 due in 14 days. No missed payments in 6 months.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-seylan-border bg-seylan-mist p-2.5">
          <p className="text-muted-foreground">Outstanding</p>
          <p className="font-bold text-seylan-charcoal">LKR 485,000</p>
        </div>
        <div className="rounded-lg border border-seylan-border bg-seylan-mist p-2.5">
          <p className="text-muted-foreground">Monthly EMI</p>
          <p className="font-bold text-seylan-charcoal">LKR 8,200</p>
        </div>
      </div>
    </div>
  );
}

// ─── Panel: Business Bookkeeper ──────────────────────────────────────────────
function BusinessPanel() {
  const weeks = [
    { label: "W1", revenue: 68, expense: 45 },
    { label: "W2", revenue: 82, expense: 52 },
    { label: "W3", revenue: 74, expense: 48 },
    { label: "W4", revenue: 91, expense: 58 },
  ];
  const maxVal = 100;
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">This Month</p>
          <p className="text-xl font-bold text-seylan-charcoal">LKR 315,000 <span className="text-emerald-600 text-sm">↑ 12%</span></p>
        </div>
        <div className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
          Tax Jar: Rs. 8,400
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-2 h-20 px-1">
        {weeks.map((w) => (
          <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 h-16">
              <div
                className="flex-1 rounded-sm bg-emerald-400"
                style={{ height: `${(w.revenue / maxVal) * 100}%` }}
              />
              <div
                className="flex-1 rounded-sm bg-red-300"
                style={{ height: `${(w.expense / maxVal) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground">{w.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-emerald-400" />Revenue</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-red-300" />Expenses</span>
      </div>

      {/* Category tags */}
      <div className="flex flex-wrap gap-1.5">
        {["Inventory · 42%", "Utilities · 18%", "Staff · 28%", "Other · 12%"].map((tag) => (
          <span key={tag} className="text-[10px] font-medium rounded-full bg-seylan-mist border border-seylan-border px-2 py-0.5 text-seylan-charcoal/70">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

const PANELS = [WalletPanel, AssistantPanel, LoansPanel, BusinessPanel];

const TOASTS = [
  "Transfer sent — LKR 12,500 ✓",
  "Response in 0.3s · Groq",
  "On track · 14 days to payment",
  "Tax jar updated — Rs. 8,400",
];

// ─── Main component ───────────────────────────────────────────────────────────
export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const Panel = PANELS[active];

  return (
    <section className="relative max-w-5xl mx-auto px-6 pb-24">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-seylan-red/10 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-1/4 h-56 w-56 rounded-full bg-seylan-plum/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-seylan-gold/10 blur-3xl" />

      <div className="relative rounded-2xl border border-seylan-border bg-white shadow-[0_32px_80px_rgba(114,28,36,0.10)] overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-seylan-border bg-seylan-mist/60 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 rounded-md bg-seylan-border/40 px-3 py-1 text-center">
            <span className="text-xs text-seylan-charcoal/50 font-mono">{URLS[active]}</span>
          </div>
        </div>

        {/* Module tabs */}
        <div className="flex overflow-x-auto border-b border-seylan-border scrollbar-hide">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = i === active;
            return (
              <button
                key={tab.label}
                onClick={() => setActive(i)}
                className={[
                  "flex shrink-0 items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-b-2",
                  isActive
                    ? "text-seylan-charcoal border-b-2"
                    : "text-muted-foreground border-transparent hover:text-seylan-charcoal hover:bg-seylan-mist/50",
                ].join(" ")}
                style={isActive ? { borderBottomColor: tab.color } : {}}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md ${tab.bg}`}
                >
                  <Icon className="h-3 w-3" style={{ color: tab.color }} />
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel content */}
        <div className="relative min-h-[280px]">
          <Panel />

          {/* Floating toast — top right */}
          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 rounded-xl border border-seylan-border bg-white px-3 py-2 shadow-md shadow-seylan-charcoal/10 text-xs font-semibold text-seylan-charcoal max-w-[180px]">
            <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: TABS[active].color }} />
            {TOASTS[active]}
          </div>

          {/* Floating chip — bottom left */}
          <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-1.5 rounded-full bg-seylan-charcoal px-3 py-1.5 text-[10px] font-semibold text-white shadow">
            <Zap className="h-3 w-3 text-seylan-gold" />
            Groq · 0.3s response
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 border-t border-seylan-border py-3">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-6" : "w-1.5 bg-seylan-border hover:bg-seylan-border/80",
              ].join(" ")}
              style={i === active ? { backgroundColor: tab.color } : {}}
              aria-label={`View ${tab.label}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
