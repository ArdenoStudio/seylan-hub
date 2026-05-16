import logging
import time
import uuid
from collections import defaultdict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import mock, wallet, chat, tts, loans, business

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")
log = logging.getLogger(__name__)


# --- Simple in-memory rate limiter ---
_rate_buckets: dict[str, list[float]] = defaultdict(list)
_RATE_LIMITS: dict[str, tuple[int, int]] = {
    "/api/chat": (20, 60),
    "/api/tts": (10, 60),
    "/api/categorize-transactions": (5, 60),
    "/api/loans/advisor": (10, 60),
}


def _check_rate_limit(path: str, client_ip: str) -> bool:
    for prefix, (max_requests, window_seconds) in _RATE_LIMITS.items():
        if path.startswith(prefix):
            key = f"{client_ip}:{prefix}"
            now = time.time()
            _rate_buckets[key] = [t for t in _rate_buckets[key] if now - t < window_seconds]
            if len(_rate_buckets[key]) >= max_requests:
                return False
            _rate_buckets[key].append(now)
            return True
    return True


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("SEYLAN HUB API STARTING — USE_SEYLAN_REAL=%s", settings.use_seylan_real)
    yield
    log.info("shutdown")


app = FastAPI(title="Seylan Hub API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    if not _check_rate_limit(request.url.path, client_ip):
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests. Please try again later."},
            headers={"Retry-After": "60"},
        )

    request_id = str(uuid.uuid4())[:8]
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-Id"] = request_id
    return response


app.include_router(mock.router)
app.include_router(wallet.router)
app.include_router(chat.router)
app.include_router(tts.router)
app.include_router(loans.router)
app.include_router(business.router)


@app.exception_handler(Exception)
async def global_error(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    log.error("unhandled error [%s] %s %s: %s", request_id, request.method, request.url.path, exc, exc_info=True)
    return JSONResponse(status_code=500, content={"error": "Internal server error", "request_id": request_id})


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}