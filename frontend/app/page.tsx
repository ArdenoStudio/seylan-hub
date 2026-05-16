import Image from "next/image";
import Link from "next/link";
import { Wallet, Bot, CreditCard, Store, ShieldCheck, ArrowRight, CheckCircle, Zap } from "lucide-react";

import { LandingNav } from "@/components/landing/LandingNav";
import { FadeContainer, FadeDiv } from "@/components/landing/Fade";
import { WordRotate } from "@/components/landing/WordRotate";
import { CTAPrimaryButton } from "@/components/landing/CTAPrimaryButton";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { TechStrip } from "@/components/landing/TechStrip";

// ─── Persona / Module Data ────────────────────────────────────────────────────
const MODULES = [
  {
    href: "/wallet",
    icon: Wallet,
    label: "Family Wallet",
    persona: "For diaspora expats sending money home",
    color: "#E31821",
    bg: "bg-red-50",
    border: "border-red-100",
    tint: "rgba(227,24,33,0.05)",
    features: [
      "Real-time allocation buckets (Education, Food, Savings)",
      "Live Seylan Bank balance & transaction feed",
      "Set spending rules per bucket",
    ],
  },
  {
    href: "/assistant",
    icon: Bot,
    label: "AI Assistant",
    persona: "For digital-native customers who want clarity",
    color: "#8B5CF6",
    bg: "bg-purple-50",
    border: "border-purple-100",
    tint: "rgba(139,92,246,0.05)",
    features: [
      "Chat in English or Sinhala — ask anything",
      "Account-aware: balance, loans, transactions",
      "Voice responses via ElevenLabs TTS",
    ],
  },
  {
    href: "/loans",
    icon: CreditCard,
    label: "Loan Dashboard",
    persona: "For anxious borrowers tracking repayments",
    color: "#3B82F6",
    bg: "bg-blue-50",
    border: "border-blue-100",
    tint: "rgba(59,130,246,0.05)",
    features: [
      "Repayment health score out of 100",
      "Next due date, outstanding balance at a glance",
      "AI advisor summary for your loan profile",
    ],
  },
  {
    href: "/business",
    icon: Store,
    label: "Business Bookkeeper",
    persona: "For Mudalali SME owners managing their books",
    color: "#10B981",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    tint: "rgba(16,185,129,0.05)",
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
    <div className="min-h-screen bg-seylan-mist">

      {/* ── Announcement bar ─────────────────────────────────────────────── */}
      <div className="bg-seylan-plum text-white py-2 px-6 text-center text-xs font-medium">
        <span className="opacity-80">Built for</span>{" "}
        <span className="font-semibold">Cursor Buildathon Colombo 2026</span>
        <span className="mx-2 text-seylan-gold">·</span>
        <span className="opacity-80">by Ardeno Studio</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 inline-flex items-center gap-1 underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          View on GitHub →
        </a>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <LandingNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <FadeContainer>
          {/* Badge */}
          <FadeDiv className="mb-6 inline-flex items-center gap-2 rounded-full border border-seylan-red/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-seylan-red shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            AI-powered · Bilingual · Real-time
          </FadeDiv>

          {/* Headline */}
          <FadeDiv>
            <h1 className="font-heading text-5xl sm:text-6xl font-semibold tracking-tight text-seylan-charcoal leading-tight">
              Banking clarity for{" "}
              <span className="text-seylan-red">
                <WordRotate
                  words={[
                    "expat families.",
                    "anxious borrowers.",
                    "Mudalali owners.",
                    "every Sri Lankan.",
                  ]}
                />
              </span>
            </h1>
          </FadeDiv>

          {/* Sub */}
          <FadeDiv className="mt-5 max-w-xl mx-auto text-base sm:text-lg leading-7 text-muted-foreground">
            Real-time Seylan Bank data. Ask in English or Sinhala. Four modules
            built for how Sri Lankans actually use money.
          </FadeDiv>

          {/* CTAs */}
          <FadeDiv className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <CTAPrimaryButton href="/wallet" size="lg">
              Open Seylan Hub
            </CTAPrimaryButton>
            <a
              href="#modules"
              className="inline-flex items-center gap-1.5 rounded-lg px-6 py-3.5 text-sm font-semibold text-seylan-charcoal/70 hover:text-seylan-charcoal transition-colors"
            >
              See all modules ↓
            </a>
          </FadeDiv>

          {/* Micro copy */}
          <FadeDiv className="mt-4 text-xs text-muted-foreground">
            Demo mode — no real bank credentials required
          </FadeDiv>

          {/* Bank logo */}
          <FadeDiv className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-seylan-border bg-white/80 px-5 py-3 shadow-sm">
            <Image
              src="/seylan-bank-logo.png"
              alt="Seylan Bank"
              width={120}
              height={44}
              className="h-8 w-auto"
              priority
            />
            <div className="h-5 w-px bg-seylan-border" />
            <span className="text-xs font-medium text-muted-foreground">
              AI-powered customer experience layer
            </span>
          </FadeDiv>
        </FadeContainer>
      </section>

      {/* ── Product showcase ──────────────────────────────────────────────── */}
      <ProductShowcase />

      {/* ── Tech strip ───────────────────────────────────────────────────── */}
      <TechStrip />

      {/* ── Modules / Personas ───────────────────────────────────────────── */}
      <section id="modules" className="max-w-6xl mx-auto px-6 py-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-5 w-[3px] rounded-full bg-seylan-red" />
          <span className="text-xs font-semibold uppercase tracking-widest text-seylan-red">
            Four modules
          </span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-seylan-charcoal mb-12">
          Built for how Sri Lankans actually use money
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MODULES.map((mod) => (
            <div
              key={mod.href}
              className="group relative rounded-2xl border border-seylan-border bg-white p-6 shadow-brand transition-all duration-200 hover:-translate-y-1 hover:shadow-brand-lg"
              style={{ backgroundColor: mod.tint }}
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${mod.bg}`}
              >
                <mod.icon className="h-5 w-5" style={{ color: mod.color }} />
              </div>

              {/* Label + persona */}
              <h3 className="font-heading text-lg font-semibold text-seylan-charcoal">
                {mod.label}
              </h3>
              <p className="mt-0.5 text-sm italic text-muted-foreground">
                {mod.persona}
              </p>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                {mod.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-seylan-charcoal/80">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: mod.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <Link
                href={mod.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                style={{ color: mod.color }}
              >
                Open module
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="about" className="bg-white border-y border-seylan-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-5 w-[3px] rounded-full bg-seylan-red" />
            <span className="text-xs font-semibold uppercase tracking-widest text-seylan-red">
              How it works
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-seylan-charcoal mb-12">
            From zero to clarity in seconds
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Steps */}
            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex gap-5">
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-seylan-red/10 text-sm font-bold text-seylan-red font-mono">
                      {step.num}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-seylan-border min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h3 className="font-heading text-base font-semibold text-seylan-charcoal">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bilingual callout */}
            <div className="rounded-2xl border border-seylan-border bg-seylan-mist p-7 space-y-4">
              <div className="text-3xl">👋</div>
              <p className="sinhala text-xl font-semibold text-seylan-charcoal leading-relaxed">
                ආයුබෝවන්
              </p>
              <p className="text-sm text-muted-foreground leading-6">
                SeylanHub speaks your language. Ask questions in Sinhala or English
                — the AI understands both. Voice responses powered by ElevenLabs
                TTS bring banking into every home.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["English", "සිංහල", "Voice TTS", "Groq llama-3.3"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-seylan-border bg-white px-3 py-1 text-xs font-medium text-seylan-charcoal/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-seylan-plum via-[#5a1520] to-seylan-charcoal p-10 sm:p-14 text-center">
          {/* Diagonal line pattern overlay */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="diag" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="12" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 uppercase tracking-widest">
              <Zap className="h-3.5 w-3.5 text-seylan-gold" />
              Demo mode · No signup needed
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Ready to see your money clearly?
            </h2>
            <p className="mx-auto max-w-md text-base text-white/70 leading-7">
              Open Seylan Hub in seconds. Realistic mock data — no Seylan Bank
              credentials required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-seylan-plum shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 group"
              >
                Open Seylan Hub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-sm font-semibold text-white/80 hover:border-white/50 hover:text-white hover:bg-white/5 transition-all duration-150"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View source on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative border-t border-seylan-border bg-white overflow-hidden">
        {/* Drifting grid bg */}
        <div
          className="pointer-events-none absolute inset-0 animate-grid-drift opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#241316 1px, transparent 1px), linear-gradient(90deg, #241316 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-8 sm:px-10 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image src="/seylan-logo.svg" alt="Seylan Bank" width={72} height={22} className="h-5 w-auto opacity-80" />
                <span className="rounded-md bg-seylan-red px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wide">Hub</span>
              </div>
              <p className="text-sm text-muted-foreground leading-6 max-w-xs">
                AI-powered banking clarity for Sri Lankan families, borrowers, and SME owners — built on Seylan Bank infrastructure.
              </p>
              <Link
                href="/wallet"
                className="inline-flex items-center gap-1.5 rounded-lg bg-seylan-red px-4 py-2 text-xs font-bold text-white hover:bg-seylan-red/90 transition-colors"
              >
                Open Hub →
              </Link>
            </div>

            {/* Modules */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Modules</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Family Wallet", href: "/wallet" },
                  { label: "AI Assistant", href: "/assistant" },
                  { label: "Loan Dashboard", href: "/loans" },
                  { label: "Business Bookkeeper", href: "/business" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-seylan-charcoal transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Built with */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Built with</p>
              <ul className="space-y-2.5">
                {["Next.js 16", "Tailwind CSS v4", "Groq llama-3.3", "ElevenLabs TTS", "Supabase Realtime"].map((t) => (
                  <li key={t} className="text-sm text-muted-foreground">{t}</li>
                ))}
              </ul>
            </div>

            {/* Legal / links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">More</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Status", href: "/status" },
                  { label: "Demo", href: "/demo" },
                  { label: "GitHub ↗", href: "https://github.com" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-seylan-charcoal transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-seylan-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© 2026 SeylanHub · Built by Ardeno Studio</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-seylan-gold inline-block" />
              Cursor Buildathon Colombo 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
