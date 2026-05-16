import { createClient } from "@supabase/supabase-js";
import { Transaction } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const supabase =
  USE_MOCK || !supabaseUrl || !supabaseAnonKey
    ? null
    : createClient(supabaseUrl, supabaseAnonKey);

export function subscribeToTransactions(
  accountId: string,
  onInsert: (transaction: Transaction) => void
) {
  if (!supabase) {
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
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
