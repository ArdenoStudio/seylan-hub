"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, Language } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";

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
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-seylan-charcoal">
            Seylan Assistant
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ask me anything about your accounts
          </p>
        </div>
        <SuggestedQuestions language={language} onSelect={onSuggestedSelect} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
