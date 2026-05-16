"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessPage() {
  const { user, mounted } = useCurrentUser();

  if (!mounted) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-seylan-charcoal mb-4">
        Business Bookkeeper
      </h1>
      <p className="text-muted-foreground">
        Viewing as {user?.name ?? "Guest"} — Mudalali business module coming up.
      </p>
    </div>
  );
}
