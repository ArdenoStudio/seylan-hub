"use client";

import { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/hooks/useVoice";
import { Language } from "@/types";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  language: Language;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceButton({ language, onTranscript, disabled }: VoiceButtonProps) {
  const { isListening, transcript, error, supported, start, stop } = useVoice();

  useEffect(() => {
    if (transcript) onTranscript(transcript);
  }, [transcript, onTranscript]);

  if (!supported) return null;

  const lang = language === "si" ? "si-LK" : "en-US";

  function handleClick() {
    if (isListening) {
      stop();
    } else {
      start(lang);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        variant={isListening ? "destructive" : "outline"}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative select-none touch-none",
          isListening && "ring-2 ring-red-500/50"
        )}
        title={
          error
            ? `Microphone error: ${error} — click to try again`
            : isListening
            ? "Listening… click to stop"
            : "Click to speak"
        }
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
          </>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {isListening && (
        <span className="text-xs text-red-400 animate-pulse select-none">
          Listening…
        </span>
      )}

      {error && !isListening && (
        <span className="text-xs text-red-400 select-none" title={error}>
          Mic error
        </span>
      )}
    </div>
  );
}
