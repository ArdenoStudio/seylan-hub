"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, Language } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { Bot, Languages, Lightbulb, ShieldAlert } from "lucide-react";

interface ChatThreadProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  language: Language;
  onSuggestedSelect: (question: string) => void;
}

export function ChatThread({
  messages,
  isStreaming,
  language,
  onSuggestedSelect,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-5 max-w-xl rounded-[1.5rem] border border-seylan-border bg-white/90 p-5 text-center shadow-xl shadow-seylan-plum/5 sm:rounded-[2rem] sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-seylan-red/10 text-seylan-red">
            <Bot className="h-7 w-7" />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-seylan-charcoal">
            Ask about your money in plain language
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check balances, explain spending, prepare for loan payments, or get
            business insights in English or Sinhala.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-xs font-medium text-seylan-charcoal">
            {[
              { label: "Explain", icon: Lightbulb },
              { label: "Plan", icon: ShieldAlert },
              { label: "Translate", icon: Languages },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.label}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-seylan-border bg-seylan-mist px-2 py-2"
                >
                  <Icon className="h-3.5 w-3.5 text-seylan-red" />
                  {mode.label}
                </div>
              );
            })}
          </div>
        </div>
        <SuggestedQuestions language={language} onSelect={onSuggestedSelect} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 sm:px-6">
      {messages.map((msg, i) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
