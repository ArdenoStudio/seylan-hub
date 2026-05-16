import { createClient } from "@supabase/supabase-js";
import { Transaction } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function subscribeToTransactions(
  accountId: string,
  onInsert: (transaction: Transaction) => void
) {
  if (!supabaseUrl || !supabaseAnonKey) {
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
        onInsert(payload.new as Transaction);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
