import { createClient } from "@supabase/supabase-js";
import { Transaction } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function subscribeToTransactions(
  accountId: string,
  onInsert: (transaction: Transaction) => void,
  onStatus?: (connected: boolean) => void
) {
  if (!supabase) {
    onStatus?.(false);
    return () => {};
  }

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
    .subscribe((status) => {
      onStatus?.(status === "SUBSCRIBED");
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
