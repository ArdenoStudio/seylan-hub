"use client";

import { Database } from "lucide-react";

export function DemoModeBadge() {
  return (
    <div className="fixed right-3 top-3 z-40 rounded-full border border-seylan-border bg-white/95 px-3 py-1 text-xs font-medium text-seylan-charcoal shadow-sm backdrop-blur">
      <span className="inline-flex items-center gap-1.5">
        <Database className="h-3.5 w-3.5 text-emerald-600" />
        Backend data
      </span>
    </div>
  );
}
