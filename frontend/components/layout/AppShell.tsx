"use client";

import { Sidebar } from "./Sidebar";
import { DemoModeBadge } from "./DemoModeBadge";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/";

  if (isOnboarding) {
    return (
      <>
        <DemoModeBadge />
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />
      <main className="flex-1 pb-20 md:ml-64 md:pb-0">
        {children}
      </main>
      <DemoModeBadge />
    </div>
  );
}
