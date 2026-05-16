"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { VoiceButton } from "./VoiceButton";
import { Language } from "@/types";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
  language: Language;
}

export function ChatInput({ onSend, disabled, language }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      onSend(text);
    },
    [onSend]
  );

  return (
    <div className="sticky bottom-0 border-t border-seylan-border bg-white/90 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-3xl gap-2 rounded-full border border-seylan-border bg-white p-2 shadow-lg shadow-seylan-plum/5">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "si"
              ? "වියදම්, ණය, හෝ බදු ගැන අසන්න..."
              : "Ask about spending, loans, or tax..."
          }
          disabled={disabled}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <VoiceButton
          language={language}
          onTranscript={handleVoiceTranscript}
          disabled={disabled}
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
