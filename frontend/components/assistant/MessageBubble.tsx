"use client";

import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "./AudioPlayer";

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
          "max-w-[82%] px-4 py-3 text-sm leading-6 shadow-sm",
          isUser
            ? "bg-seylan-red text-white rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] rounded-tr-md"
            : "border border-seylan-border bg-white text-seylan-charcoal rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-md"
        )}
      >
        <p
          className={cn(
            "whitespace-pre-wrap",
            message.language === "si" && "sinhala"
          )}
        >
          {message.content}
        </p>
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-current opacity-50 animate-pulse ml-0.5" />
        )}
        {!isUser && !isStreaming && message.content && (
          <AudioPlayer text={message.content} language={message.language} />
        )}
      </div>
    </div>
  );
}
