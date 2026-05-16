"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssistantPage() {
  const { user, mounted } = useCurrentUser();

  if (!mounted) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-seylan-charcoal mb-4">
        AI Assistant
      </h1>
      <p className="text-muted-foreground">
        Viewing as {user?.name ?? "Guest"} — Chat assistant module coming up.
      </p>
    </div>
  );
}
