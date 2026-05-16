"use client";

import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "./AudioPlayer";
import { formatLKR } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const pa = message.payment_action;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] px-4 py-3 text-sm leading-6",
          isUser
            ? "bg-seylan-red text-white shadow-lg shadow-seylan-red/20 rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] rounded-tr-md"
            : "border border-white/[0.08] bg-white/[0.06] text-white/85 backdrop-blur-sm rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-md"
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
          <span className="inline-block w-1.5 h-4 bg-current opacity-60 animate-pulse ml-0.5 rounded-sm" />
        )}
        {pa && !isStreaming && (
          <a
            href={pa.checkout_url}
            className={cn(
              "mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5",
              "bg-seylan-red text-white text-sm font-semibold",
              "hover:bg-seylan-red/90 transition-colors"
            )}
          >
            <span>💳</span>
            <span>Pay {formatLKR(pa.amount_lkr)} →</span>
          </a>
        )}
        {!isUser && !isStreaming && message.content && (
          <AudioPlayer text={message.content} language={message.language} />
        )}
      </div>
    </div>
  );
}
