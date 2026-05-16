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
    <div className="sticky bottom-0 border-t border-seylan-border bg-white p-4">
      <div className="flex gap-2 max-w-3xl mx-auto">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={disabled}
          className="flex-1"
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
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
