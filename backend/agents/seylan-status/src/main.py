import asyncio
import os
import time

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BACKEND_URL = os.getenv("SEYLAN_BACKEND_URL", "http://localhost:8000").rstrip("/")
TIMEOUT = float(os.getenv("CHECK_TIMEOUT_SECONDS", "5.0"))

app = FastAPI(title="SeylanHub Status Agent", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

SERVICES: dict[str, dict] = {
    "health": {
        "label": "Backend Health",
        "url": f"{BACKEND_URL}/health",
        "method": "GET",
    },
    "wallet": {
        "label": "Wallet Service",
        "url": f"{BACKEND_URL}/api/wallet/rules/demo_user",
        "method": "GET",
    },
    "loans": {
        "label": "Loans Service",
        "url": f"{BACKEND_URL}/api/loans/demo_user/health",
        "method": "GET",
    },
    "mock": {
        "label": "Mock / Fixtures",
        "url": f"{BACKEND_URL}/mock/account-context/demo_user",
        "method": "GET",
    },
}


async def _probe(client: httpx.AsyncClient, name: str, cfg: dict) -> dict:
    t0 = time.perf_counter()
    try:
        r = await client.request(cfg["method"], cfg["url"], timeout=TIMEOUT)
        latency = round((time.perf_counter() - t0) * 1000)
        return {
            "service": name,
            "label": cfg["label"],
            "status": "up" if r.status_code < 500 else "degraded",
            "http_status": r.status_code,
            "latency_ms": latency,
        }
    except (httpx.TimeoutException, httpx.ConnectError) as exc:
        latency = round((time.perf_counter() - t0) * 1000)
        return {
            "service": name,
            "label": cfg["label"],
            "status": "down",
            "http_status": None,
            "latency_ms": latency,
            "error": type(exc).__name__,
        }


async def _full_status() -> dict:
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*[_probe(client, n, c) for n, c in SERVICES.items()])

    services = list(results)
    all_up = all(s["status"] == "up" for s in services)
    any_down = any(s["status"] == "down" for s in services)
    overall = "operational" if all_up else ("outage" if any_down else "degraded")

    return {
        "overall": overall,
        "backend_url": BACKEND_URL,
        "services": services,
        "checked_at": time.time(),
    }


# ── Nasiko agent health ────────────────────────────────────────────────────────

@app.get("/health")
async def agent_health():
    return {"status": "healthy", "service": "seylan-status"}


# ── Status endpoints ───────────────────────────────────────────────────────────

@app.get("/status")
async def full_status():
    """Return a full status report for every SeylanHub service."""
    return await _full_status()


@app.get("/check/{service}")
async def check_service(service: str):
    """Probe a single service by key (health | wallet | loans | mock)."""
    if service not in SERVICES:
        return {
            "error": f"Unknown service '{service}'.",
            "available": list(SERVICES.keys()),
        }
    async with httpx.AsyncClient() as client:
        return await _probe(client, service, SERVICES[service])


# ── Nasiko natural-language entry point ───────────────────────────────────────

class QueryRequest(BaseModel):
    query: str
    context: dict = {}


@app.post("/")
async def handle_query(req: QueryRequest):
    """
    Called by the Nasiko router when a query matches this agent.
    Supports natural-language questions like "is the wallet service up?"
    """
    q = req.query.lower()

    # Check if user asked about a specific service
    for name, cfg in SERVICES.items():
        if name in q or cfg["label"].lower() in q:
            async with httpx.AsyncClient() as client:
                result = await _probe(client, name, cfg)
            status_emoji = {"up": "✅", "degraded": "⚠️", "down": "❌"}.get(result["status"], "❓")
            return {
                "response": (
                    f"{status_emoji} {result['label']} is **{result['status']}** "
                    f"(HTTP {result['http_status']}, {result['latency_ms']} ms)"
                ),
                "data": result,
            }

    # Default: full status summary
    status = await _full_status()
    up = sum(1 for s in status["services"] if s["status"] == "up")
    total = len(status["services"])
    overall_emoji = {"operational": "✅", "degraded": "⚠️", "outage": "❌"}.get(
        status["overall"], "❓"
    )
    return {
        "response": (
            f"{overall_emoji} SeylanHub backend is **{status['overall']}**. "
            f"{up}/{total} services up."
        ),
        "data": status,
    }
