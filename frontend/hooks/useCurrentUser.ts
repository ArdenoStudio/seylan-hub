"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DEMO_USERS } from "@/lib/demo-users";
import { DemoUser } from "@/types";

const STORAGE_KEY = "seylan_hub_user_id";

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUserId(stored);
    }
  }, []);

  const switchUser = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setUserId(id);
  }, []);

  const user: DemoUser | null = useMemo(() => {
    if (!userId) return null;
    return DEMO_USERS.find((u) => u.id === userId) ?? null;
  }, [userId]);

  return {
    userId,
    user,
    switchUser,
    allUsers: DEMO_USERS,
    mounted,
  };
}
