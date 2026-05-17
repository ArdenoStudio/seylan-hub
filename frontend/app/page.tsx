"use client";
import Image from "next/image";
import { Wallet, Cpu, CreditCard, Shop, ShieldCheck, ArrowRight, CheckCircle, Flash, Microphone } from "iconoir-react";

import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background";

import { LandingNav } from "@/components/landing/LandingNav";
import { FadeContainer, FadeDiv } from "@/components/landing/Fade";
import { WordRotate } from "@/components/landing/WordRotate";
import { CTAPrimaryButton } from "@/components/landing/CTAPrimaryButton";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { TechStrip } from "@/components/landing/TechStrip";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { APP_URL } from "@/lib/config";

// ─── Data ─────────────────────────────────────────────────────────────────────
const MODULES = [
  {
    href: `${APP_URL}/wallet`,
    icon: Wallet,
    label: "Family Wallet",
    num: "01",
    persona: "For diaspora expats sending money home",
    color: "#E31821",
    colorLight: "#FEE2E2",
    gradient: "from-[#E31821] to-[#D9A441]",
    features: [
      "Real-time allocation buckets (Education, Food, Savings)",
      "Live Seylan Bank balance & transaction feed",
      "Set spending rules per bucket",
    ],
  },
  {
    href: `${APP_URL}/assistant`,
    icon: Cpu,
    label: "AI Assistant",
    num: "02",
    persona: "For digital-native customers who want clarity",
    color: "#8B5CF6",
    colorLight: "#EDE9FE",
    gradient: "from-[#8B5CF6] to-[#6366F1]",
    features: [
      "Chat in English or Sinhala — ask anything",
      "Account-aware: balance, loans, transactions",
      "Voice responses via ElevenLabs TTS",
    ],
  },
  {
    href: `${APP_URL}/loans`,
    icon: CreditCard,
    label: "Loan Dashboard",
    num: "03",
    persona: "For anxious borrowers tracking repayments",
    color: "#3B82F6",
    colorLight: "#DBEAFE",
    gradient: "from-[#3B82F6] to-[#06B6D4]",
    features: [
      "Repayment health score out of 100",
      "Next due date, outstanding balance at a glance",
      "AI advisor summary for your loan profile",
    ],
  },
  {
    href: `${APP_URL}/business`,
    icon: Shop,
    label: "Business Bookkeeper",
    num: "04",
    persona: "For Mudalali SME owners managing their books",
    color: "#10B981",
    colorLight: "#D1FAE5",
    gradient: "from-[#10B981] to-[#059669]",
    features: [
      "Weekly P&L with AI-categorised transactions",
      "Automatic tax jar savings (set your rate)",
      "Simple dashboard — no accounting degree needed",
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Open in demo mode",
    desc: "No signup, no credentials. The demo runs on realistic mock data from a fictional Seylan Bank account.",
  },
  {
    num: "02",
    title: "Pick your module",
    desc: "Choose the persona that matches you — expat family, borrower, SME owner, or everyday banking.",
  },
  {
    num: "03",
    title: "Get AI insights in real time",
    desc: "Ask questions in English or Sinhala. See live charts, health scores, and bookkeeping summaries.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-seylan-mist relative overflow-x-hidden">
      {/* ── Falling pattern background ────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <FallingPattern
          color="rgba(227, 24, 33, 0.55)"
          backgroundColor="var(--background)"
          duration={80}
          blurIntensity="0.4em"
          className="h-full [mask-image:radial-gradient(ellipse_100%_85%_at_50%_0%,black_30%,transparent_100%)]"
        />
      </div>

      {/* ── Grain overlay for atmosphere ───────────────────────────────────── */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.035] mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat bg-[length:128px_128px]" />

      {/* ── Floating pill nav (fixed) ─────────────────────────────────────── */}
      <LandingNav />

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-20">


      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 overflow-visible">
        {/* Ambient glow behind hero text */}
        <div className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 h-[420px] w-[600px] rounded-full bg-gradient-to-b from-seylan-red/[0.06] via-seylan-gold/[0.04] to-transparent blur-3xl" />

        {/* ── Floating left card: Family Wallet ─────────────────────────── */}
        <div
          className="pointer-events-none hidden xl:block absolute left-6 top-[210px] z-0 opacity-0"
          style={{ animation: "fadeUp 600ms 1000ms cubic-bezier(0.22,1,0.36,1) forwards" }}
        >
          <div className="animate-float-left w-52 rounded-2xl border border-seylan-border/60 bg-white/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(114,28,36,0.13)] p-4 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-md bg-red-50 flex items-center justify-center">
                  <Wallet className="h-3 w-3 text-seylan-red" />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Family Wallet</span>
              </div>
              <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-seylan-red flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-seylan-red inline-block animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Kumari Perera</p>
            <p className="text-xl font-bold text-seylan-charcoal mb-3">LKR 245,000</p>
            <div className="space-y-2">
              {[
                { label: "School Fees", pct: 40, color: "#E31821" },
                { label: "Household", pct: 40, color: "#D9A441" },
                { label: "Savings", pct: 20, color: "#721C24" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-seylan-charcoal/70">{b.label}</span>
                    <span className="font-semibold" style={{ color: b.color }}>{b.pct}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-seylan-border/40">
                    <div className="h-1 rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
              <CheckCircle className="h-3 w-3" />
              GBP 600 → LKR 244,980 — Delivered
            </div>
          </div>
        </div>

        {/* ── Floating right card: AI Assistant ────────────────────────── */}
        <div
          className="pointer-events-none hidden xl:block absolute right-6 top-[150px] z-0 opacity-0"
          style={{ animation: "fadeUp 600ms 1200ms cubic-bezier(0.22,1,0.36,1) forwards" }}
        >
          <div className="animate-float-right w-52 rounded-2xl border border-seylan-border/60 bg-white/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(114,28,36,0.10)] p-4 text-left space-y-2.5">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-md bg-purple-50 flex items-center justify-center">
                <Cpu className="h-3 w-3 text-purple-600" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">AI Assistant</span>
              <span className="ml-auto text-[9px] font-bold text-purple-400">Groq</span>
            </div>
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-sm bg-seylan-red px-2.5 py-1.5 text-[11px] text-white max-w-[85%]">
                What is my balance?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm bg-purple-50 border border-purple-100 px-2.5 py-1.5 max-w-[90%]">
                <p className="sinhala text-[12px] font-semibold text-seylan-charcoal">ශේෂය රු. 245,000</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Balance: LKR 245,000</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-seylan-border bg-seylan-mist/60 px-2.5 py-1.5">
              <span className="flex-1 text-[10px] text-muted-foreground/60">Ask in Sinhala or English…</span>
              <Microphone className="h-3 w-3 text-purple-400 shrink-0" />
            </div>
            <div className="text-center text-[9px] text-muted-foreground/50 flex items-center justify-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              0.3s · llama-3.3
            </div>
          </div>
        </div>

        {/* ── Hero content (centred, narrower than the outer section) ──── */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeContainer>
            {/* Badge */}
            <FadeDiv className="mb-8 inline-flex items-center gap-2 rounded-full border border-seylan-red/15 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-seylan-red shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              AI-powered · Bilingual · Real-time
            </FadeDiv>

            {/* Headline */}
            <FadeDiv>
              <h1 className="font-heading text-[clamp(2.75rem,6vw,4.5rem)] font-semibold tracking-[-0.03em] text-seylan-charcoal leading-[1.08]">
                Banking clarity for{" "}
                <span className="relative text-seylan-red">
                  <WordRotate
                    words={[
                      "expat families.",
                      "anxious borrowers.",
                      "Mudalali owners.",
                      "every Sri Lankan.",
                    ]}
                  />
                  <span className="absolute -bottom-1 left-0 right-0 h-[4px] rounded-full bg-gradient-to-r from-seylan-red/80 via-seylan-gold/70 to-transparent" />
                </span>
              </h1>
            </FadeDiv>

            {/* Sub */}
            <FadeDiv className="mt-6 max-w-lg mx-auto text-base sm:text-lg leading-7 text-muted-foreground">
              Real-time Seylan Bank data. Ask in English or Sinhala. Four modules
              built for how Sri Lankans actually use money.
            </FadeDiv>

            {/* CTAs */}
            <FadeDiv className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <CTAPrimaryButton href={`${APP_URL}/wallet`} size="lg">
                Open SeylanHub
              </CTAPrimaryButton>
              <a
                href="#modules"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-seylan-charcoal/15 px-6 py-3.5 text-sm font-semibold text-seylan-charcoal/65 hover:text-seylan-charcoal hover:border-seylan-charcoal/30 hover:bg-white/60 backdrop-blur-sm transition-all duration-200"
              >
                See all modules
                <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
              </a>
            </FadeDiv>

            {/* Micro copy */}
            <FadeDiv className="mt-4 text-xs text-muted-foreground/70 tracking-wide">
              Demo mode — no real bank credentials required
            </FadeDiv>

            {/* Bank logo lockup */}
            <FadeDiv className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-seylan-border/60 bg-white/60 backdrop-blur-md px-5 py-3 shadow-[0_2px_20px_rgba(114,28,36,0.06)]">
              <Image
                src="/seylan-bank-logo.png"
                alt="Seylan Bank"
                width={120}
                height={44}
                className="h-8 w-auto"
                priority
              />
              <div className="h-5 w-px bg-seylan-border/50" />
              <span className="text-xs font-medium text-muted-foreground">
                Your Seylan Bank, reimagined
              </span>
            </FadeDiv>

            {/* Stats strip */}
            <FadeDiv className="mt-8 flex items-center justify-center divide-x divide-seylan-border/50 flex-wrap gap-y-2">
              {[
                { num: "4", label: "Modules" },
                { num: "EN + සිංහල", label: "Bilingual" },
                { num: "0.3s", label: "AI Response" },
                { num: "Demo", label: "No credentials" },
              ].map((stat) => (
                <div key={stat.label} className="px-5 first:pl-0 last:pr-0 text-center">
                  <p className="font-heading text-[13px] font-semibold text-seylan-charcoal">{stat.num}</p>
                  <p className="text-[10px] text-muted-foreground/60 tracking-wide mt-0.5">{stat.label}</p>
                </div>
              ))}
            </FadeDiv>
          </FadeContainer>
        </div>
      </section>

      {/* ── Product showcase ───────────────────────────────────────────────── */}
      <ProductShowcase />

      {/* ── Phone mockup ──────────────────────────────────────────────────── */}
      <PhoneMockup />

      {/* ── Tech strip ────────────────────────────────────────────────────── */}
      <TechStrip />

      {/* ── Modules / Personas ────────────────────────────────────────────── */}
      <section id="modules" className="relative max-w-6xl mx-auto px-6 py-28">
        {/* Section ambient glows */}
        <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-seylan-red/[0.04] blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-seylan-gold/[0.05] blur-[100px]" />

        <div className="flex items-center gap-3 mb-3">
          <div className="h-5 w-[3px] rounded-full bg-seylan-red" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-seylan-red">
            Four modules
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-seylan-charcoal max-w-lg">
            Built for how Sri Lankans actually use money
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Four purpose-built modules, each designed for a specific Sri Lankan banking persona.
          </p>
        </div>

        {/* Hero card (01) + stacked cards layout */}
        <div className="flex flex-col gap-5">
          {/* Row 1: Hero card spanning full width */}
          {(() => {
            const mod = MODULES[0];
            return (
              <a
                key={mod.href}
                href={mod.href}
                style={{ animationDelay: "0ms" }}
                className="group relative overflow-hidden rounded-2xl border border-seylan-border/50 bg-white/90 backdrop-blur-sm shadow-[0_2px_16px_rgba(114,28,36,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(114,28,36,0.12)] hover:border-seylan-border/80 animate-fade-up"
              >
                {/* Bold left border accent */}
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-all duration-500 group-hover:w-1.5"
                  style={{ background: `linear-gradient(to bottom, ${mod.color}, ${mod.color}60)` }}
                />

                {/* Background color wash on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse 60% 80% at 100% 50%, ${mod.color}07, transparent 70%)` }}
                />

                {/* Giant watermark number */}
                <div
                  className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 font-heading font-bold leading-none select-none transition-opacity duration-500 opacity-[0.04] group-hover:opacity-[0.07] text-[11rem]"
                  style={{ color: mod.color }}
                >
                  {mod.num}
                </div>

                <div className="relative pl-10 pr-8 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center gap-8">
                  {/* Left: icon + title + persona */}
                  <div className="sm:w-64 shrink-0">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: mod.colorLight }}
                    >
                      <mod.icon className="h-6 w-6" style={{ color: mod.color }} />
                    </div>
                    <h3 className="font-heading text-2xl font-semibold text-seylan-charcoal tracking-tight mb-2">
                      {mod.label}
                    </h3>
                    <span
                      className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: mod.colorLight, color: mod.color }}
                    >
                      {mod.persona}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className="hidden sm:block self-stretch w-px shrink-0"
                    style={{ background: `linear-gradient(to bottom, transparent, ${mod.color}25, transparent)` }}
                  />

                  {/* Right: features */}
                  <ul className="flex-1 grid sm:grid-cols-3 gap-4">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] text-seylan-charcoal/75 leading-relaxed">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: mod.color }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div
                    className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3"
                    style={{ color: mod.color }}
                  >
                    Open module
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            );
          })()}

          {/* Row 2: cards 02–04 in a 3-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {MODULES.slice(1).map((mod, i) => (
              <a
                key={mod.href}
                href={mod.href}
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
                className="group relative overflow-hidden rounded-2xl border border-seylan-border/50 bg-white/90 backdrop-blur-sm shadow-[0_2px_16px_rgba(114,28,36,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(114,28,36,0.12)] hover:border-seylan-border/80 animate-fade-up"
              >
                {/* Bold left border accent */}
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-all duration-500 group-hover:w-1.5"
                  style={{ background: `linear-gradient(to bottom, ${mod.color}, ${mod.color}60)` }}
                />

                {/* Background color wash on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 100% 0%, ${mod.color}07, transparent 70%)` }}
                />

                {/* Giant watermark number */}
                <div
                  className="pointer-events-none absolute right-4 bottom-4 font-heading font-bold leading-none select-none transition-opacity duration-500 opacity-[0.04] group-hover:opacity-[0.07] text-[6rem]"
                  style={{ color: mod.color }}
                >
                  {mod.num}
                </div>

                <div className="relative pl-8 pr-6 py-7">
                  {/* Icon */}
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: mod.colorLight }}
                  >
                    <mod.icon className="h-5 w-5" style={{ color: mod.color }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-semibold text-seylan-charcoal tracking-tight mb-2">
                    {mod.label}
                  </h3>

                  {/* Persona pill */}
                  <span
                    className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-5"
                    style={{ backgroundColor: mod.colorLight, color: mod.color }}
                  >
                    {mod.persona}
                  </span>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-seylan-charcoal/70 leading-relaxed">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: mod.color }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                    style={{ color: mod.color }}
                  >
                    Open module
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="about" className="relative bg-white/80 backdrop-blur-sm border-y border-seylan-border/60 py-28">
        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,#241316_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-5 w-[3px] rounded-full bg-seylan-red" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-seylan-red">
              How it works
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-seylan-charcoal mb-14">
            From zero to clarity in seconds
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Steps — card treatment */}
            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="group relative overflow-hidden rounded-2xl border border-seylan-border/50 bg-white/90 backdrop-blur-sm shadow-[0_2px_16px_rgba(114,28,36,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(114,28,36,0.10)] animate-fade-up"
                >
                  {/* Bold left border accent */}
                  <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-seylan-red to-seylan-red/40 transition-all duration-500 group-hover:w-1.5" />

                  {/* Hover wash */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(227,24,33,0.04),transparent_70%)]" />

                  {/* Giant watermark number */}
                  <div className="pointer-events-none absolute right-5 bottom-2 font-heading font-bold leading-none select-none text-[6rem] text-seylan-red opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500">
                    {step.num}
                  </div>

                  <div className="relative pl-8 pr-6 py-6 flex gap-5 items-start">
                    <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-seylan-red/10 to-seylan-red/5 text-sm font-bold text-seylan-red font-mono ring-1 ring-seylan-red/10 transition-transform duration-300 group-hover:scale-110">
                      {step.num}
                    </div>
                    <div className="pt-0.5">
                      <h3 className="font-heading text-base font-semibold text-seylan-charcoal tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bilingual callout — elevated */}
            <div
              style={{ animationDelay: "240ms" }}
              className="group relative overflow-hidden rounded-2xl border border-seylan-border/60 bg-white/90 backdrop-blur-sm shadow-[0_4px_24px_rgba(114,28,36,0.06)] animate-fade-up"
            >
              {/* Bold left border — gold accent to differentiate */}
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-seylan-gold to-seylan-gold/40" />

              {/* Corner glow */}
              <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-[4rem] bg-gradient-to-bl from-seylan-gold/[0.07] to-transparent" />

              {/* Giant watermark */}
              <div className="pointer-events-none absolute right-6 bottom-4 sinhala font-bold leading-none select-none text-[5rem] text-seylan-gold opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-500">
                ස
              </div>

              <div className="relative pl-8 pr-8 py-8 space-y-4">
                <div className="text-4xl leading-none">👋</div>
                <p className="sinhala text-3xl font-semibold text-seylan-charcoal leading-relaxed tracking-tight">
                  ආයුබෝවන්
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  SeylanHub speaks your language. Ask questions in Sinhala or English
                  — the AI understands both. Voice responses powered by ElevenLabs
                  TTS bring banking into every home.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["English", "සිංහල", "Voice TTS", "Groq llama-3.3"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-seylan-border/60 bg-white/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-seylan-charcoal/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-seylan-plum via-[#5a1520] to-seylan-charcoal p-12 sm:p-16 text-center">
          {/* Radial glow accent */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-seylan-red/20 blur-[120px]" />

          {/* Diagonal line overlay */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diag" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="12" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>

          {/* Dot grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:20px_20px]" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold text-white/80 uppercase tracking-[0.15em]">
              <Flash className="h-3.5 w-3.5 text-seylan-gold" />
              Demo mode · No signup needed
            </div>
            <h2 className="font-heading text-3xl sm:text-[2.75rem] font-semibold text-white tracking-[-0.02em] leading-tight">
              Ready to see your money clearly?
            </h2>
            <p className="mx-auto max-w-md text-base text-white/60 leading-7">
              Open SeylanHub in seconds. Realistic mock data — no Seylan Bank credentials required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={`${APP_URL}/wallet`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-seylan-plum shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 group"
              >
                Open SeylanHub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://github.com/ArdenoStudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/70 hover:border-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_100%_80%_at_50%_100%,#000_60%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_100%_80%_at_50%_100%,#000_60%,transparent_100%)]">
          <FluidParticlesBackground
            particleColor="217,164,65"
            particleCount={1800}
            noiseIntensity={0.003}
            particleSize={{ min: 0.5, max: 2 }}
            className="w-full h-full"
          />
        </div>
        <footer className="relative z-10 max-w-6xl mx-auto rounded-[2rem] border border-seylan-border/50 bg-white/60 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.05)] px-8 sm:px-10 pt-10 pb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-8 border-b border-seylan-border/40">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image src="/seylan-bank-icon.png" alt="Seylan" width={28} height={28} className="h-7 w-7" />
                <span className="font-heading text-lg font-semibold tracking-tight text-seylan-charcoal">Seylan Hub</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                AI-powered banking clarity for Sri Lankan families, borrowers, and SME owners — built on Seylan Bank infrastructure.
              </p>
              <a
                href={`${APP_URL}/wallet`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-seylan-red px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-seylan-red/90 hover:-translate-y-px transition-all duration-150"
              >
                Open Hub →
              </a>
            </div>

            {/* Modules */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-4">Modules</p>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Family Wallet", href: `${APP_URL}/wallet` },
                  { label: "AI Assistant", href: `${APP_URL}/assistant` },
                  { label: "Loan Dashboard", href: `${APP_URL}/loans` },
                  { label: "Business Bookkeeper", href: `${APP_URL}/business` },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-muted-foreground hover:text-seylan-charcoal transition-colors duration-200">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Built with */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-4">Built with</p>
              <ul className="space-y-3 text-sm">
                {["Next.js 16", "Tailwind CSS v4", "Groq llama-3.3", "ElevenLabs TTS", "Supabase Realtime"].map((t) => (
                  <li key={t} className="text-muted-foreground">{t}</li>
                ))}
              </ul>
            </div>

            {/* More */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-4">More</p>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Live App ↗", href: APP_URL },
                  { label: "Status ↗", href: `${APP_URL}/status` },
                  { label: "GitHub ↗", href: "https://github.com/ArdenoStudio" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-seylan-charcoal transition-colors duration-200">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <span>© 2026 SeylanHub by Team Ardent</span>
            </div>
            <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="600 300 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#14120B" d="M999.994 554.294C999.994 559.859 999.994 565.419 999.962 570.984C999.935 575.67 999.882 580.357 999.753 585.038C999.475 595.247 998.875 605.542 997.059 615.639C995.217 625.88 992.212 635.409 987.477 644.718C982.822 653.861 976.738 662.233 969.485 669.491C962.227 676.748 953.861 682.828 944.712 687.482C935.409 692.217 925.875 695.222 915.633 697.065C905.537 698.88 895.242 699.48 885.033 699.759C880.346 699.887 875.665 699.941 870.978 699.968C865.413 700.005 859.853 700 854.288 700H745.695C740.13 700 734.571 700 729.005 699.968C724.319 699.941 719.632 699.887 714.951 699.759C704.742 699.48 694.447 698.88 684.35 697.065C674.109 695.222 664.58 692.217 655.271 687.482C646.128 682.828 637.756 676.743 630.499 669.491C623.241 662.233 617.161 653.866 612.507 644.718C607.772 635.414 604.767 625.88 602.925 615.639C601.109 605.542 600.509 595.247 600.23 585.038C600.102 580.352 600.048 575.67 600.021 570.984C600 565.419 600 559.859 600 554.294V445.701C600 440.136 600 434.576 600.032 429.011C600.059 424.324 600.112 419.637 600.241 414.956C600.52 404.747 601.119 394.452 602.935 384.356C604.778 374.115 607.783 364.586 612.518 355.277C617.172 346.133 623.257 337.762 630.509 330.504C637.767 323.246 646.133 317.167 655.282 312.512C664.586 307.777 674.12 304.772 684.361 302.93C694.458 301.114 704.752 300.514 714.961 300.236C719.648 300.107 724.329 300.054 729.016 300.027C734.576 300 740.136 300 745.701 300H854.294C859.859 300 865.419 300 870.984 300.032C875.67 300.059 880.357 300.112 885.038 300.241C895.247 300.52 905.542 301.119 915.639 302.935C925.88 304.778 935.409 307.783 944.718 312.518C953.861 317.172 962.233 323.257 969.491 330.509C976.748 337.767 982.828 346.133 987.482 355.282C992.217 364.586 995.222 374.12 997.065 384.361C998.88 394.458 999.48 404.752 999.759 414.961C999.887 419.648 999.941 424.329 999.968 429.016C1000.01 434.581 1000 440.141 1000 445.706V554.299L999.994 554.294Z" />
                <path fill="#EDECEC" d="M920.015 424.958L805.919 359.086C802.256 356.97 797.735 356.97 794.071 359.086L679.981 424.958C676.901 426.736 675 430.025 675 433.587V566.419C675 569.981 676.901 573.269 679.981 575.048L794.077 640.92C797.74 643.036 802.261 643.036 805.925 640.92L920.02 575.048C923.1 573.269 925.001 569.981 925.001 566.419V433.587C925.001 430.025 923.1 426.736 920.02 424.958H920.015ZM912.848 438.911L802.706 629.682C801.961 630.968 799.995 630.443 799.995 628.954V504.039C799.995 501.543 798.662 499.234 796.498 497.981L688.321 435.526C687.036 434.781 687.561 432.816 689.05 432.816H909.334C912.462 432.816 914.417 436.206 912.853 438.917H912.848V438.911Z" />
              </svg>
              Cursor Buildathon Colombo 2026
            </p>
          </div>
        </footer>
      </div>

      </div>{/* end relative z-10 content wrapper */}
    </div>
  );
}
