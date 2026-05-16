import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Transaction } from "@/types";
import { formatLKR } from "@/lib/utils";

export function fireSpendToast(transaction: Transaction, newBucketBalance?: number) {
  const description = newBucketBalance !== undefined
    ? `${transaction.bucket_label} balance: ${formatLKR(newBucketBalance)}`
    : undefined;

  toast(`Kumari just spent ${formatLKR(transaction.amount_lkr)} — ${transaction.merchant}`, {
    description,
    icon: <Bell className="h-4 w-4 text-seylan-red" />,
  });
}
