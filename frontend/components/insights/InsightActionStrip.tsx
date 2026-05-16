"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InsightTone = "alert" | "success" | "info" | "neutral";

interface InsightItem {
  label: string;
  value: string;
  detail: string;
  tone?: InsightTone;
  icon: LucideIcon;
}

interface InsightAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
}

interface InsightActionStripProps {
  eyebrow: string;
  title: string;
  insights: InsightItem[];
  actions?: InsightAction[];
}

const toneStyles: Record<InsightTone, string> = {
  alert: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-seylan-border bg-seylan-mist text-seylan-plum",
};

export function InsightActionStrip({
  eyebrow,
  title,
  insights,
  actions = [],
}: InsightActionStripProps) {
  return (
    <section className="rounded-[1.5rem] card-glass shadow-brand p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-heading text-xl font-semibold text-seylan-charcoal sm:text-2xl">
            {title}
          </h2>
        </div>

        {actions.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex xl:shrink-0">
            {actions.map((action) => {
              const Icon = action.icon;
              const content = (
                <>
                  <Icon className="h-4 w-4" />
                  {action.label}
                </>
              );

              if (action.href) {
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "justify-center rounded-full"
                    )}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <Button
                  key={action.label}
                  variant="outline"
                  onClick={action.onClick}
                  className="justify-center rounded-full"
                >
                  {content}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <article
              key={insight.label}
              className={cn(
                "rounded-2xl border p-4",
                toneStyles[insight.tone ?? "neutral"]
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] opacity-75">
                  {insight.label}
                </span>
                <Icon className="h-4 w-4 shrink-0" />
              </div>
              <div className="text-2xl font-semibold leading-none">
                {insight.value}
              </div>
              <p className="mt-2 text-sm leading-5 opacity-80">
                {insight.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
