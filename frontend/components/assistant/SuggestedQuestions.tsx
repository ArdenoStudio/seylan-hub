"use client";

import { Language } from "@/types";

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
    <div className="flex flex-wrap gap-2 justify-center px-4">
      {questions.map((q) => {
        const isSinhala = /[\u0D80-\u0DFF]/.test(q);
        return (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className={cn(
              "px-3 py-2 text-sm rounded-full border border-seylan-border hover:border-seylan-red/50 hover:bg-seylan-red/5 transition-colors text-seylan-charcoal",
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
