"use client";

import { Sidebar } from "./Sidebar";
import { DemoModeBadge } from "./DemoModeBadge";
import {
  pathnameShowsSeylanHandoff,
  SeylanBankHandoffBanner,
} from "@/components/seylan/SeylanBankHandoffBanner";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/";
  /** MPGS injects iframes/modals on document.body — avoid sidebar stacking and fixed layout clashes. */
  const isPaymentGatewaySurface =
    pathname.startsWith("/payments/checkout") || pathname.startsWith("/payments/return");
  const showSeylanHandoff = pathnameShowsSeylanHandoff(pathname);

  if (isOnboarding || isPaymentGatewaySurface) {
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
      <main className="flex flex-1 min-w-0 flex-col pb-20 md:ml-64 md:pb-0">
        <div className="flex-1">{children}</div>
        {showSeylanHandoff ? <SeylanBankHandoffBanner /> : null}
      </main>
      <DemoModeBadge />
    </div>
  );
}
