import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import mock, wallet, chat, tts, loans, business, debug

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")
log = logging.getLogger(__name__)


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

app.include_router(mock.router)
app.include_router(wallet.router)
app.include_router(chat.router)
app.include_router(tts.router)
app.include_router(loans.router)
app.include_router(business.router)
app.include_router(debug.router)


@app.exception_handler(Exception)
async def global_error(request: Request, exc: Exception):
    log.error("unhandled error %s %s: %s", request.method, request.url.path, exc, exc_info=True)
    return JSONResponse(status_code=500, content={"error": str(exc)})


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}