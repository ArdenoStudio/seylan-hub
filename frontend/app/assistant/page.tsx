"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useChat } from "@/hooks/useChat";
import { ChatThread } from "@/components/assistant/ChatThread";
import { ChatInput } from "@/components/assistant/ChatInput";
import { LanguageToggle } from "@/components/assistant/LanguageToggle";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssistantPage() {
  const { user, mounted } = useCurrentUser();
  const { messages, isStreaming, language, setLanguage, send } = useChat(
    user?.id ?? "SEY-USR-001"
  );

  if (!mounted) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen">
      <div className="flex items-center justify-between px-4 py-3 border-b border-seylan-border bg-white">
        <h1 className="text-lg font-bold text-seylan-charcoal">
          AI Assistant
        </h1>
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
