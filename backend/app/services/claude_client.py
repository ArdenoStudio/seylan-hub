"""AI client with extended thinking + streaming.

Uses Claude (Anthropic) when ANTHROPIC_API_KEY is set.
Falls back to DeepSeek-R1 on Groq which natively outputs <think> blocks.
"""
import logging
from typing import AsyncIterator

from app.config import settings

log = logging.getLogger(__name__)

_GROQ_THINKING_MODEL = "deepseek-r1-distill-llama-70b"
_CLAUDE_MODEL = "claude-sonnet-4-6"
_THINKING_BUDGET = 5000
_MAX_TOKENS = 8000


async def _stream_groq_thinking(
    system_prompt: str, messages: list[dict]
) -> AsyncIterator[tuple[str, str]]:
    """Stream from DeepSeek-R1 on Groq, parsing <think>...</think> blocks."""
    from app.services import groq_client

    OPEN = "<think>"
    CLOSE = "</think>"
    buffer = ""
    in_think = False

    async for chunk in groq_client.stream_chat_model(
        _GROQ_THINKING_MODEL, system_prompt, messages, max_tokens=2048, temperature=0.6
    ):
        buffer += chunk

        while True:
            if in_think:
                end = buffer.find(CLOSE)
                if end == -1:
                    safe = max(0, len(buffer) - len(CLOSE))
                    if safe:
                        yield ("thinking", buffer[:safe])
                        buffer = buffer[safe:]
                    break
                else:
                    if end > 0:
                        yield ("thinking", buffer[:end])
                    buffer = buffer[end + len(CLOSE):]
                    in_think = False
            else:
                start = buffer.find(OPEN)
                if start == -1:
                    safe = max(0, len(buffer) - len(OPEN))
                    if safe:
                        yield ("token", buffer[:safe])
                        buffer = buffer[safe:]
                    break
                else:
                    if start > 0:
                        yield ("token", buffer[:start])
                    buffer = buffer[start + len(OPEN):]
                    in_think = True

    if buffer.strip():
        yield ("thinking" if in_think else "token", buffer)


async def stream_chat(
    system_prompt: str,
    messages: list[dict],
) -> AsyncIterator[tuple[str, str]]:
    """
    Yields (event_type, content) tuples.
    event_type is 'thinking' (reasoning text) or 'token' (reply text).

    Uses Claude with extended thinking if ANTHROPIC_API_KEY is set,
    otherwise uses DeepSeek-R1 on Groq which natively reasons with <think> tags.
    """
    if not settings.anthropic_api_key:
        async for item in _stream_groq_thinking(system_prompt, messages):
            yield item
        return

    import anthropic
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    clean_messages = [
        m for m in messages
        if m.get("content") is not None and m.get("role") in ("user", "assistant")
    ]

    async with client.messages.stream(
        model=_CLAUDE_MODEL,
        system=system_prompt,
        messages=clean_messages,
        max_tokens=_MAX_TOKENS,
        thinking={"type": "enabled", "budget_tokens": _THINKING_BUDGET},
    ) as stream:
        async for event in stream:
            if event.type == "content_block_delta":
                delta = event.delta
                if delta.type == "thinking_delta":
                    yield ("thinking", delta.thinking)
                elif delta.type == "text_delta":
                    yield ("token", delta.text)
