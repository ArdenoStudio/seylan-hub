"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

export function UserSwitcher() {
  const { user, allUsers, switchUser } = useCurrentUser();
  const router = useRouter();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-white hover:bg-sidebar-accent transition-colors">
        <span className="truncate">{user.name}</span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {allUsers.map((u) => (
          <DropdownMenuItem
            key={u.id}
            onClick={() => {
              switchUser(u.id);
              router.push(u.defaultRoute);
            }}
          >
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-muted-foreground">{u.location}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
