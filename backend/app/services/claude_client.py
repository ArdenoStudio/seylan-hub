"""AI client with streaming.

Uses OpenAI (gpt-4o) when OPENAI_API_KEY is set.
Falls back to DeepSeek-R1 on Groq which natively outputs <think> blocks.
"""
import logging
from typing import AsyncIterator

from app.config import settings

log = logging.getLogger(__name__)

_GROQ_THINKING_MODEL = "deepseek-r1-distill-llama-70b"
_OPENAI_MODEL = "gpt-4o"
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

    Uses OpenAI gpt-4o if OPENAI_API_KEY is set,
    otherwise uses DeepSeek-R1 on Groq which natively reasons with <think> tags.
    """
    if not settings.openai_api_key:
        async for item in _stream_groq_thinking(system_prompt, messages):
            yield item
        return

    import openai
    client = openai.AsyncOpenAI(api_key=settings.openai_api_key)

    clean_messages: list[dict] = [{"role": "system", "content": system_prompt}]
    clean_messages += [
        m for m in messages
        if m.get("content") is not None and m.get("role") in ("user", "assistant")
    ]

    stream = await client.chat.completions.create(
        model=_OPENAI_MODEL,
        messages=clean_messages,  # type: ignore[arg-type]
        max_tokens=_MAX_TOKENS,
        stream=True,
    )

    async for chunk in stream:
        delta = chunk.choices[0].delta if chunk.choices else None
        if delta and delta.content:
            yield ("token", delta.content)
