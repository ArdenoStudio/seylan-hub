"use client";

import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 text-sm",
          isUser
            ? "bg-seylan-red text-white rounded-tl-[18px] rounded-bl-[18px] rounded-br-[18px] rounded-tr-[4px]"
            : "bg-seylan-mist text-seylan-charcoal rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px] rounded-tl-[4px]"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-current opacity-50 animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  );
}
