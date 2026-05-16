"use client";

import { Database, FlaskConical } from "lucide-react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export function DemoModeBadge() {
  return (
    <div className="fixed right-3 top-3 z-40 rounded-full border border-seylan-border bg-white/95 px-3 py-1 text-xs font-medium text-seylan-charcoal shadow-sm backdrop-blur">
      <span className="inline-flex items-center gap-1.5">
        {USE_MOCK ? (
          <FlaskConical className="h-3.5 w-3.5 text-amber-600" />
        ) : (
          <Database className="h-3.5 w-3.5 text-emerald-600" />
        )}
        {USE_MOCK ? "Demo data" : "Live API"}
      </span>
    </div>
  );
}
