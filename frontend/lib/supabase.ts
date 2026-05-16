import { createClient } from "@supabase/supabase-js";
import { Transaction } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function subscribeToTransactions(
  accountId: string,
  onInsert: (transaction: Transaction) => void,
  onStatusChange?: (connected: boolean) => void
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    onStatusChange?.(false);
    return () => {};
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const channel = supabase
    .channel(`transactions:${accountId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "transactions",
        filter: `account_id=eq.${accountId}`,
      },
      (payload) => {
        const row = payload.new as Record<string, unknown>;
        // #region agent log H-A
        fetch('http://127.0.0.1:7903/ingest/f6b07d8c-426b-4e0d-9bf5-677b52351ced',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea4af'},body:JSON.stringify({sessionId:'5ea4af',location:'supabase.ts:29',message:'realtime INSERT row keys and timestamp fields',data:{rowKeys:Object.keys(row),timestamp:row.timestamp,txn_date:row.txn_date,created_at:row.created_at,id:row.id,merchant:row.merchant},hypothesisId:'H-A',timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        const tx: Transaction = {
          transaction_id: (row.id as string) ?? (row.transaction_id as string),
          account_id: row.account_id as string,
          merchant: row.merchant as string,
          amount_lkr: row.amount_lkr as number,
          type: (row.type as "debit" | "credit") ?? "debit",
          timestamp: (row.timestamp as string) ?? (row.created_at as string),
          bucket_id: row.bucket_id as string | undefined,
          bucket_label: row.bucket_label as string | undefined,
        };
        onInsert(tx);
      }
    )
    .subscribe((status) => {
      onStatusChange?.(status === "SUBSCRIBED");
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
