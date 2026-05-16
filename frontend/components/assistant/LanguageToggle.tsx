"use client";

import { Language } from "@/types";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  language: Language;
  onChange: (lang: Language) => void;
}

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-seylan-mist rounded-full p-1">
      <button
        onClick={() => onChange("en")}
        className={cn(
          "px-3 py-1 text-xs rounded-full transition-colors",
          language === "en"
            ? "bg-white text-seylan-charcoal shadow-sm font-medium"
            : "text-muted-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => onChange("si")}
        className={cn(
          "px-3 py-1 text-xs rounded-full transition-colors sinhala",
          language === "si"
            ? "bg-white text-seylan-charcoal shadow-sm font-medium"
            : "text-muted-foreground"
        )}
      >
        SI
      </button>
    </div>
  );
}
