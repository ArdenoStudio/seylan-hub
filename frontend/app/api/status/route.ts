import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT = 5000;

interface ServiceResult {
  key: string;
  label: string;
  description: string;
  status: "up" | "degraded" | "down";
  latency: number | null;
  httpStatus: number | null;
}

async function probe(
  key: string,
  label: string,
  description: string,
  url: string
): Promise<ServiceResult> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
      cache: "no-store",
    });
    const latency = Date.now() - t0;
    return {
      key,
      label,
      description,
      status: res.ok ? "up" : "degraded",
      latency,
      httpStatus: res.status,
    };
  } catch {
    return {
      key,
      label,
      description,
      status: "down",
      latency: Date.now() - t0,
      httpStatus: null,
    };
  }
}

export async function GET() {
  const checks = await Promise.all([
    probe("api", "Core API", "FastAPI backend health", `${BACKEND}/health`),
    probe(
      "wallet",
      "Wallet Service",
      "Family wallet & transfer engine",
      `${BACKEND}/api/wallet/rules/demo_user`
    ),
    probe(
      "loans",
      "Loans Service",
      "Loan health scoring & advisor",
      `${BACKEND}/api/loans/demo_user/health`
    ),
    probe(
      "mock",
      "Demo Data",
      "Fixtures & mock account context",
      `${BACKEND}/mock/account-context/demo_user`
    ),
  ]);

  const allUp = checks.every((c) => c.status === "up");
  const anyDown = checks.some((c) => c.status === "down");
  const overall: "operational" | "degraded" | "outage" = allUp
    ? "operational"
    : anyDown
    ? "outage"
    : "degraded";

  return NextResponse.json(
    { overall, services: checks, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
