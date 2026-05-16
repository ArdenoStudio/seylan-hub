"use client";

import { Language } from "@/types";
import { cn } from "@/lib/utils";

interface SuggestedQuestionsProps {
  language: Language;
  onSelect: (question: string) => void;
}

const EN_QUESTIONS = [
  "What is my savings balance?",
  "When is my next loan payment?",
  "How much have I paid on my loan?",
  "What's my biggest expense this month?",
];

const SI_QUESTIONS = [
  "මගේ ඉතිරිකිරීමේ ශේෂය කොපමණද?",
  "මගේ ඊළඟ ණය වාරිකය කවදාද?",
];

export function SuggestedQuestions({
  language,
  onSelect,
}: SuggestedQuestionsProps) {
  const questions =
    language === "si" ? [...EN_QUESTIONS, ...SI_QUESTIONS] : EN_QUESTIONS;

  return (
    <div className="flex max-w-3xl flex-wrap justify-center gap-2 px-4">
      {questions.map((q) => {
        const isSinhala = /[\u0D80-\u0DFF]/.test(q);
        return (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className={cn(
              "rounded-full border border-seylan-border bg-white/80 px-3 py-2 text-sm text-seylan-charcoal shadow-sm transition-colors hover:border-seylan-red/50 hover:bg-seylan-red/5",
              isSinhala && "sinhala"
            )}
          >
            {q}
          </button>
        );
      })}
    </div>
  );
}
