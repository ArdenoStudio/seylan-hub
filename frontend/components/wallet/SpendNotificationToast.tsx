import { toast } from "sonner";
import { Transaction } from "@/types";
import { formatLKR } from "@/lib/utils";

export function fireSpendToast(transaction: Transaction, newBucketBalance?: number) {
  const bucketPart = transaction.bucket_label ? ` · ${transaction.bucket_label}` : "";
  const description = newBucketBalance !== undefined
    ? `New ${transaction.bucket_label ?? "bucket"} balance: ${formatLKR(newBucketBalance)}`
    : undefined;

  toast(
    `Kumari just spent ${formatLKR(transaction.amount_lkr)} — ${transaction.merchant}${bucketPart}`,
    { description, icon: "🔔" }
  );
}
