export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

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
  return request(`/mock/account-context/${userId}`);
}

interface RawWalletResponse {
  account_id: string;
  account_holder: string;
  linked_sender: string;
  total_balance_lkr: number;
  last_remittance?: Record<string, unknown>;
  buckets?: Record<string, unknown>[];
  recent_transactions?: Record<string, unknown>[];
  [key: string]: unknown;
}

export async function getFamilyWallet(accountId: string) {
  const raw = await request<RawWalletResponse>(`/mock/family-wallet/${accountId}`);
  return {
    ...raw,
    last_remittance: raw.last_remittance ? {
      ...raw.last_remittance,
      amount_gbp: (raw.last_remittance as Record<string, unknown>).sender_amount_gbp ?? (raw.last_remittance as Record<string, unknown>).amount_gbp,
      fx_rate: (raw.last_remittance as Record<string, unknown>).exchange_rate ?? (raw.last_remittance as Record<string, unknown>).fx_rate,
    } : undefined,
    buckets: (raw.buckets ?? []).map((b) => ({
      ...b,
      bucket_id: (b as Record<string, unknown>).bucket_id ?? (b as Record<string, unknown>).id,
      allocation_pct: (b as Record<string, unknown>).allocation_pct ?? (b as Record<string, unknown>).allocated_pct,
    })),
    recent_transactions: (raw.recent_transactions ?? []).map((t) => ({
      ...t,
      transaction_id: (t as Record<string, unknown>).transaction_id ?? (t as Record<string, unknown>).id,
      timestamp: (t as Record<string, unknown>).timestamp ?? (t as Record<string, unknown>).date,
      type: (t as Record<string, unknown>).type ?? ((t as Record<string, unknown>).amount_lkr as number) < 0 ? "debit" : "credit",
    })),
  };
}

export async function getLoans(userId: string) {
  const data = await request<Record<string, unknown>>(`/mock/loans/${userId}`);
  if (data && Array.isArray((data as Record<string, unknown>).loans)) {
    const loans = (data as Record<string, unknown>).loans as unknown[];
    return loans[0] ?? null;
  }
  if (Array.isArray(data)) {
    return (data as unknown[])[0] ?? null;
  }
  return data;
}

export async function getBusinessAccount(userId: string) {
  return request(`/mock/business-account/${userId}`);
}

export async function getPlSummary(userId: string) {
  return request(`/mock/pl-summary/${userId}`);
}

export async function postWalletTransfer(payload: {
  sender_account_id: string;
  recipient_account_id: string;
  amount_lkr: number;
  corridor: string;
  allocation_rules: Record<string, number>;
}) {
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

export async function getSandboxTransferAccounts() {
  return request<{
    source_account: string;
    destination_account: string;
  }>("/api/wallet/sandbox-transfer-accounts");
}

export async function saveAllocationRules(
  senderId: string,
  allocations: Record<string, number>,
  accountId = "SEY-ACC-002"
) {
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
  onToken: (token: string) => void,
  onError?: (message: string) => void
): Promise<void> {
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
          if (parsed.error) {
            onError?.(parsed.error);
            return;
          }
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
  return request<{ audio_base64: string; content_type: string }>("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

interface CategorizedItem {
  id: string;
  category_en: string;
  category_si: string;
  subcategory: string;
  confidence: number;
}

export async function postCategorize(payload: { transaction_ids: string[] }): Promise<
  Record<string, { category_en: string; category_si: string; subcategory: string }>
> {
  const raw = await request<{ categorized: CategorizedItem[] }>("/api/categorize-transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const map: Record<string, { category_en: string; category_si: string; subcategory: string }> = {};
  for (const item of raw.categorized ?? []) {
    map[item.id] = {
      category_en: item.category_en,
      category_si: item.category_si,
      subcategory: item.subcategory,
    };
  }
  return map;
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
  const result = await request("/mock/reset-demo", {
    method: "POST",
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("seylan:demo-reset"));
  }
  return result;
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
}): Promise<{ new_balance: number; tax_saved: number }> {
  const raw = await request<{
    new_tax_jar_balance_lkr?: number;
    new_balance?: number;
    tax_transfer_amount_lkr?: number;
  }>("/mock/tax-jar/trigger", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return {
    new_balance: raw.new_tax_jar_balance_lkr ?? raw.new_balance ?? 0,
    tax_saved: raw.tax_transfer_amount_lkr ?? Math.round(payload.incoming_amount_lkr * 0.1),
  };
}

export function postTriggerSpend(payload: {
  account_id: string;
  amount_lkr: number;
  merchant: string;
  bucket_id: string;
}) {
  return request("/mock/trigger-spend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
