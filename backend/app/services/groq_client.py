import logging
from typing import AsyncIterator
from groq import AsyncGroq
from app.config import settings

log = logging.getLogger(__name__)
_client: AsyncGroq | None = None


def _get_client() -> AsyncGroq:
    global _client
    if _client is None:
        if not settings.groq_api_key:
            raise RuntimeError("GROQ_API_KEY is not set")
        _client = AsyncGroq(api_key=settings.groq_api_key)
    return _client


async def stream_chat(system_prompt: str, messages: list[dict],
                      max_tokens: int = 512, temperature: float = 0.3) -> AsyncIterator[str]:
    msgs = [{"role": "system", "content": system_prompt}] + messages
    stream = await _get_client().chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=msgs,
        max_tokens=max_tokens,
        temperature=temperature,
        stream=True,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


async def complete(system_prompt: str, messages: list[dict],
                   max_tokens: int = 512, temperature: float = 0.3) -> str:
    msgs = [{"role": "system", "content": system_prompt}] + messages
    resp = await _get_client().chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=msgs,
        max_tokens=max_tokens,
        temperature=temperature,
        stream=False,
    )
    return resp.choices[0].message.content or ""