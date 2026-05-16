"use client";

import { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/hooks/useVoice";
import { Language } from "@/types";

interface VoiceButtonProps {
  language: Language;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceButton({
  language,
  onTranscript,
  disabled,
}: VoiceButtonProps) {
  const { isListening, transcript, supported, start, stop } = useVoice();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!supported) return null;

  const lang = language === "si" ? "si-LK" : "en-US";

  return (
    <Button
      size="icon"
      variant={isListening ? "destructive" : "outline"}
      onMouseDown={() => start(lang)}
      onMouseUp={stop}
      onTouchStart={() => start(lang)}
      onTouchEnd={stop}
      disabled={disabled}
      className="relative"
      title="Hold to speak"
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
