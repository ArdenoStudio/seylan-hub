"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(
      !!(
        (window as typeof window & { SpeechRecognition?: unknown }).SpeechRecognition ??
        (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
      )
    );
  }, []);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  const SpeechRecognitionCtor =
    typeof window !== "undefined"
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null)
      : null;

  const start = useCallback(
    (lang = "en-US") => {
      if (!SpeechRecognitionCtor) {
        setError("Speech recognition not supported in this browser");
        return;
      }

      // Stop any in-flight session
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = lang;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      finalTranscriptRef.current = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = finalTranscriptRef.current;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0]?.transcript ?? "";
          } else {
            interim += result[0]?.transcript ?? "";
          }
        }
        finalTranscriptRef.current = final;
        // Show live interim transcript
        setTranscript(final + interim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== "aborted") {
          setError(event.error);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return { isListening, transcript, error, supported, start, stop };
}
