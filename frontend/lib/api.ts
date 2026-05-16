import {
  MOCK_WALLET,
  getMockLoan,
  MOCK_PL_SUMMARY,
  MOCK_BUSINESS_TRANSACTIONS,
  getMockChatResponse,
} from "./mock-data";
import { Transaction } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

/** When true, wallet/transfer calls stay client-side; refetch after transfer would wipe local state. */
export const isApiMockMode = USE_MOCK;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new ApiError(res.status, text);
  }
  return res.json();
}

export async function getAccountContext(userId: string) {
  if (USE_MOCK) {
    return { user_id: userId, account_holder: "Demo User", accounts: [], balance_lkr: 245000, language_preference: "en" };
  }
  return request(`/mock/account-context/${userId}`);
}

export async function getFamilyWallet(accountId: string) {
  if (USE_MOCK) return MOCK_WALLET;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await request<any>(`/mock/family-wallet/${accountId}`);
    // Normalise backend field names to our WalletState shape
    return {
      ...raw,
      last_remittance: raw.last_remittance ? {
        ...raw.last_remittance,
        amount_gbp: raw.last_remittance.sender_amount_gbp ?? raw.last_remittance.amount_gbp,
        fx_rate: raw.last_remittance.exchange_rate ?? raw.last_remittance.fx_rate,
      } : undefined,
      buckets: (raw.buckets ?? []).map((b: any) => ({
        ...b,
        bucket_id: b.bucket_id ?? b.id,
        allocation_pct: b.allocation_pct ?? b.allocated_pct,
      })),
      recent_transactions: (raw.recent_transactions ?? []).map((t: any) => ({
        ...t,
        transaction_id: t.transaction_id ?? t.id,
        timestamp: t.timestamp ?? t.date,
        type: t.type ?? (t.amount_lkr < 0 ? "debit" : "credit"),
      })),
    };
  } catch {
    return MOCK_WALLET;
  }
}

export async function getLoans(userId: string) {
  if (USE_MOCK) return getMockLoan(userId);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await request<any>(`/mock/loans/${userId}`);
    // Backend returns { loans: [...] }, unwrap to single Loan
    if (data && Array.isArray(data.loans)) return data.loans[0] ?? getMockLoan(userId);
    return Array.isArray(data) ? data[0] : data;
  } catch {
    return getMockLoan(userId);
  }
}

export async function getBusinessAccount(userId: string) {
  if (USE_MOCK) return { transactions: MOCK_BUSINESS_TRANSACTIONS };
  try {
    return await request(`/mock/business-account/${userId}`);
  } catch {
    return { transactions: MOCK_BUSINESS_TRANSACTIONS };
  }
}

export async function getPlSummary(userId: string) {
  if (USE_MOCK) return MOCK_PL_SUMMARY;
  try {
    return await request(`/mock/pl-summary/${userId}`);
  } catch {
    return MOCK_PL_SUMMARY;
  }
}

export async function postWalletTransfer(payload: {
  sender_account_id: string;
  recipient_account_id: string;
  amount_lkr: number;
  corridor: string;
  allocation_rules: Record<string, number>;
}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("seylan:mock-remittance", {
          detail: {
            account_id: payload.recipient_account_id,
            amount_lkr: payload.amount_lkr,
            sender_id: payload.sender_account_id,
            allocations: payload.allocation_rules,
          },
        })
      );
    }
    return { success: true, amount_lkr: payload.amount_lkr };
  }
  // Backend expects list[{bucket_id, pct}], not Record<string, number>
  const normalised = {
    ...payload,
    allocation_rules: Object.entries(payload.allocation_rules).map(
      ([bucket_id, pct]) => ({ bucket_id, pct })
    ),
  };
  return request("/api/wallet/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalised),
  });
}

export async function saveAllocationRules(
  senderId: string,
  allocations: Record<string, number>,
  accountId = "SEY-ACC-002"
) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return { status: "saved" };
  }
  return request(`/api/wallet/rules/${senderId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      account_id: accountId,
      allocation_rules: Object.entries(allocations).map(([bucket_id, pct]) => ({
        bucket_id,
        pct,
      })),
    }),
  });
}

export async function postChat(
  payload: {
    user_id: string;
    session_id: string;
    message: string;
    language: string;
    history: { role: string; content: string }[];
  },
  onToken: (token: string) => void
): Promise<void> {
  if (USE_MOCK) {
    const response = getMockChatResponse(payload.user_id, payload.message);
    const words = response.split(" ");
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
      onToken(word + " ");
    }
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "Unknown error");
      throw new ApiError(res.status, text);
    }

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (parsed.done) return;
          if (parsed.token) onToken(parsed.token);
        } catch {
          // skip malformed lines
        }
      }
    }
  } finally {
    clearTimeout(timeout);
  }
}

export function postTts(payload: { text: string; language: string }) {
  if (USE_MOCK) {
    throw new ApiError(503, "TTS is only available when connected to the backend");
  }

  return request<{ audio_base64: string; content_type: string }>("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function postCategorize(payload: { transaction_ids: string[] }) {
  if (USE_MOCK) {
    return {};
  }
  return request("/api/categorize-transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function prewarmDemoData() {
  await Promise.all([
    getFamilyWallet("SEY-ACC-002"),
    getLoans("SEY-USR-001"),
    getLoans("SEY-USR-003"),
    getBusinessAccount("SEY-BIZ-001"),
    getPlSummary("SEY-BIZ-001"),
    postCategorize({ transaction_ids: [] }).catch(() => null),
  ]);
}

export async function postDemoReset() {
  if (USE_MOCK) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("seylan:demo-reset"));
    }
    return { success: true, mode: "mock" };
  }

  return request("/mock/reset-demo", {
    method: "POST",
  });
}

export function postTaxJarRule(payload: {
  user_id: string;
  rule: string;
  percentage: number;
}) {
  return request("/api/tax-jar/rule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function postTaxJarTrigger(payload: {
  user_id: string;
  incoming_amount_lkr: number;
  description: string;
}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const taxAmount = Math.round(payload.incoming_amount_lkr * 0.1);
    return { new_balance: 15070 + taxAmount, tax_saved: taxAmount };
  }
  return request("/mock/tax-jar/trigger", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function postTriggerSpend(payload: {
  account_id: string;
  amount_lkr: number;
  merchant: string;
  bucket_id: string;
}) {
  if (USE_MOCK) {
    const tx: Transaction = {
      transaction_id: `mock-${Date.now()}`,
      account_id: payload.account_id,
      bucket_id: payload.bucket_id,
      bucket_label:
        payload.bucket_id === "bucket_school"
          ? "School"
          : payload.bucket_id === "bucket_savings"
          ? "Savings"
          : "Household",
      amount_lkr: payload.amount_lkr,
      merchant: payload.merchant,
      timestamp: new Date().toISOString(),
      type: "debit",
    };

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<Transaction>("seylan:mock-transaction", {
          detail: tx,
        })
      );
    }

    return Promise.resolve({ success: true, transaction: tx });
  }

  return request("/mock/trigger-spend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
