import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.schemas import TtsRequest, TtsResponse
from app.services import elevenlabs_client

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["tts"])


@router.post("/tts")
async def tts(req: TtsRequest):
    try:
        audio = elevenlabs_client.text_to_speech_b64(req.text, req.language)
        duration_ms = max(500, len(req.text) * 60)
        return TtsResponse(audio_base64=audio, content_type="audio/mpeg", duration_ms=duration_ms)
    except RuntimeError as exc:
        log.warning("TTS not configured: %s", exc)
        return JSONResponse(status_code=503,
                            content={"error": "TTS service unavailable", "detail": str(exc)})
    except Exception as exc:
        log.error("TTS error: %s", exc)
        return JSONResponse(status_code=503,
                            content={"error": "TTS service unavailable", "detail": str(exc)})