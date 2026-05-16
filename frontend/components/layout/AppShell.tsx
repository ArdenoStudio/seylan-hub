"use client";

import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/";

  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-60 pb-16 md:pb-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
