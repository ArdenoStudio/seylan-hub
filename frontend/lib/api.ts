const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new ApiError(res.status, text);
  }
  return res.json();
}

export function getAccountContext(userId: string) {
  return request(`/mock/account-context/${userId}`);
}

export function getFamilyWallet(accountId: string) {
  return request(`/mock/family-wallet/${accountId}`);
}

export function getLoans(userId: string) {
  return request(`/mock/loans/${userId}`);
}

export function getBusinessAccount(userId: string) {
  return request(`/mock/business-account/${userId}`);
}

export function getPlSummary(userId: string) {
  return request(`/mock/pl-summary/${userId}`);
}

export function postWalletTransfer(payload: {
  sender_account_id: string;
  recipient_account_id: string;
  amount_lkr: number;
  corridor: string;
  allocation_rules: Record<string, number>;
}) {
  return request("/api/wallet/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
}

export function postTts(payload: { text: string; language: string }) {
  return request<{ audio_base64: string; content_type: string }>("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function postCategorize(payload: { transaction_ids: string[] }) {
  return request("/api/categorize-transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

export function postTaxJarTrigger(payload: {
  user_id: string;
  incoming_amount_lkr: number;
  description: string;
}) {
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
  return request("/mock/trigger-spend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
