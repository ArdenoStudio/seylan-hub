"use client";

import { useState, useCallback, useMemo, useSyncExternalStore } from "react";
import { DEMO_USERS } from "@/lib/demo-users";
import { DemoUser } from "@/types";

const STORAGE_KEY = "seylan_hub_user_id";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

export function useCurrentUser() {
  const storedId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localId, setLocalId] = useState<string | null>(storedId);

  const userId = localId ?? storedId;

  const switchUser = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setLocalId(id);
  }, []);

  const user: DemoUser | null = useMemo(() => {
    if (!userId) return null;
    return DEMO_USERS.find((u) => u.id === userId) ?? null;
  }, [userId]);

  const mounted = typeof window !== "undefined";

  return {
    userId,
    user,
    switchUser,
    allUsers: DEMO_USERS,
    mounted,
  };
}
