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
  const { isListening, transcript, supported, start, stop } = useVoice();

  useEffect(() => {
    if (transcript) onTranscript(transcript);
  }, [transcript, onTranscript]);

  if (!supported) return null;

  const lang = language === "si" ? "si-LK" : "en-US";

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    // Capture pointer so pointerup fires even if user drags off the button
    e.currentTarget.setPointerCapture(e.pointerId);
    start(lang);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    stop();
  }

  return (
    <Button
      size="icon"
      variant={isListening ? "destructive" : "outline"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={stop}
      disabled={disabled}
      className={cn(
        "relative select-none touch-none",
        isListening && "ring-2 ring-red-500/50"
      )}
      title="Hold to speak"
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
  );
}
