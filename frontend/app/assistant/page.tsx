"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useChat } from "@/hooks/useChat";
import { ChatThread } from "@/components/assistant/ChatThread";
import { ChatInput } from "@/components/assistant/ChatInput";
import { LanguageToggle } from "@/components/assistant/LanguageToggle";
import { Skeleton } from "@/components/ui/skeleton";

function AssistantPageContent() {
  const { user, mounted } = useCurrentUser();
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const promptSentRef = useRef(false);
  const { messages, isStreaming, language, setLanguage, send } = useChat(
    user?.id ?? "SEY-USR-001"
  );

  useEffect(() => {
    if (!mounted || !prompt || promptSentRef.current || isStreaming) return;
    promptSentRef.current = true;
    send(prompt);
  }, [mounted, prompt, isStreaming, send]);

  if (!mounted) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-88px)] flex-col md:h-screen">
      <div className="flex items-center justify-between border-b border-seylan-border bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-seylan-red">
            Bilingual banking AI
          </p>
          <h1 className="font-heading text-xl font-semibold text-seylan-charcoal">
            Seylan Assistant
          </h1>
        </div>
        <LanguageToggle language={language} onChange={setLanguage} />
      </div>

      <ChatThread
        messages={messages}
        isStreaming={isStreaming}
        language={language}
        onSuggestedSelect={send}
      />

      <ChatInput onSend={send} disabled={isStreaming} language={language} />
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <AssistantPageContent />
    </Suspense>
  );
}
