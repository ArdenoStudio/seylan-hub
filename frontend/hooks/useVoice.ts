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

const FATAL_MIC_ERRORS = new Set(["not-allowed", "service-not-allowed", "audio-capture"]);

/** Errors that should not tear down a press‑and‑hold session; the engine ends and we reconnect. */
const NON_FATAL_SESSION_ERRORS = new Set(["no-speech", "aborted", "network"]);

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(
        (window as typeof window & { SpeechRecognition?: unknown }).SpeechRecognition ??
        (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
      )
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const sessionFinalRef = useRef("");
  const sessionActiveRef = useRef(false);
  const langRef = useRef("en-US");
  const restartTimerRef = useRef<number | null>(null);

  const SpeechRecognitionCtor =
    typeof window !== "undefined"
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null)
      : null;

  const stop = useCallback(() => {
    sessionActiveRef.current = false;
    if (restartTimerRef.current !== null) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    const r = recognitionRef.current;
    if (r) {
      r.onresult = null;
      r.onerror = null;
      r.onend = null;
      try {
        r.stop();
      } catch {
        try {
          r.abort();
        } catch {
          /* ignore */
        }
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const clearRestartTimerOnly = () => {
    if (restartTimerRef.current !== null) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  /** Created each render — handlers always read fresh refs/setters. Do not stash in deps. */
  function beginRecognition(lang: string, resetAccumulator: boolean): void {
    if (!SpeechRecognitionCtor) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    langRef.current = lang;

    if (resetAccumulator) {
      sessionFinalRef.current = "";
      setTranscript("");
    }

    const prev = recognitionRef.current;
    if (prev) {
      prev.onresult = null;
      prev.onerror = null;
      prev.onend = null;
      try {
        prev.abort();
      } catch {
        try {
          prev.stop();
        } catch {
          /* ignore */
        }
      }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let finalPart = sessionFinalRef.current;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalPart += result[0]?.transcript ?? "";
        } else {
          interim += result[0]?.transcript ?? "";
        }
      }
      sessionFinalRef.current = finalPart;
      setTranscript(finalPart + interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;

      if (FATAL_MIC_ERRORS.has(event.error)) {
        sessionActiveRef.current = false;
        clearRestartTimerOnly();
        setError(event.error);
        setIsListening(false);
        recognitionRef.current = null;
        return;
      }

      if (!NON_FATAL_SESSION_ERRORS.has(event.error)) {
        setError(event.error);
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (!sessionActiveRef.current) {
        setIsListening(false);
        return;
      }
      clearRestartTimerOnly();
      restartTimerRef.current = window.setTimeout(() => {
        restartTimerRef.current = null;
        if (!sessionActiveRef.current || !SpeechRecognitionCtor) return;
        beginRecognition(langRef.current, false);
      }, 0);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      if (sessionActiveRef.current && SpeechRecognitionCtor) {
        clearRestartTimerOnly();
        restartTimerRef.current = window.setTimeout(() => {
          restartTimerRef.current = null;
          if (!sessionActiveRef.current) return;
          beginRecognition(langRef.current, false);
        }, 0);
      } else {
        setIsListening(false);
      }
    }
  }

  function start(lang = "en-US"): void {
    if (!SpeechRecognitionCtor) {
      setError("Speech recognition not supported in this browser");
      return;
    }
    clearRestartTimerOnly();
    sessionActiveRef.current = true;
    setError(null);
    beginRecognition(lang, true);
  }

  return { isListening, transcript, error, supported, start, stop };
}
