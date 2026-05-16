"use client";

import { useState, useRef, useCallback } from "react";

interface UseVoiceReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  supported: boolean;
  start: (lang?: string) => void;
  stop: () => void;
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const SpeechRecognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const supported = !!SpeechRecognition;

  const start = useCallback(
    (lang = "en-US") => {
      if (!SpeechRecognition) {
        setError("Speech recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0]?.[0]?.transcript ?? "";
        setTranscript(result);
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setTranscript("");
      setError(null);
      setIsListening(true);
      recognition.start();
    },
    [SpeechRecognition]
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, error, supported, start, stop };
}
