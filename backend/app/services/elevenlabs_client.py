import base64
import logging
from functools import lru_cache
from elevenlabs import ElevenLabs
from app.config import settings

log = logging.getLogger(__name__)


@lru_cache(maxsize=32)
def _tts_cached(text: str, language: str) -> bytes:
    if not settings.elevenlabs_api_key:
        raise RuntimeError("ELEVENLABS_API_KEY is not set")
    client = ElevenLabs(api_key=settings.elevenlabs_api_key)
    # SDK v2+ uses text_to_speech.convert(); v1 used client.generate()
    audio_iter = client.text_to_speech.convert(
        voice_id=settings.elevenlabs_voice_id,
        text=text,
        model_id="eleven_multilingual_v2",
    )
    return b"".join(audio_iter)


def text_to_speech(text: str, language: str = "en") -> bytes:
    return _tts_cached(text, language)


def text_to_speech_b64(text: str, language: str = "en") -> str:
    return base64.b64encode(text_to_speech(text, language)).decode("ascii")