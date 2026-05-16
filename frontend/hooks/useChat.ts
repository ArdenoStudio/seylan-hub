"use client";

import { useState, useRef, useCallback } from "react";
import { ChatMessage, Language } from "@/types";
import { postChat } from "@/lib/api";

export function useChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const sessionIdRef = useRef(crypto.randomUUID());

  const send = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        language,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      const aiMsgId = crypto.randomUUID();
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        language,
      };
      setMessages((prev) => [...prev, aiMsg]);

      try {
        await postChat(
          {
            user_id: userId,
            session_id: sessionIdRef.current,
            message: content,
            language,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
          (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId ? { ...m, content: m.content + token } : m
              )
            );
          }
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  content:
                    "I'm having trouble connecting right now. Try again in a moment.",
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [userId, language, messages]
  );

  return { messages, isStreaming, language, setLanguage, send };
}
