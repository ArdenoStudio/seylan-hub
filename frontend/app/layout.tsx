import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_Sinhala, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const headingFont = Sora({
  variable: "--font-cal-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSinhala = Noto_Sans_Sinhala({
  variable: "--font-noto-sinhala",
  subsets: ["sinhala"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://seylan-hub.vercel.app"
  ),
  title: "Seylan Hub",
  description:
    "AI banking for Sri Lanka — diaspora wallets, voice assistant, loan health, and bookkeeping for SMEs",
  manifest: "/manifest.json",
  icons: {
    icon: "/seylan-bank-icon.png",
    apple: "/seylan-bank-icon.png",
  },
  openGraph: {
    title: "Seylan Hub",
    description:
      "AI banking for Sri Lanka — diaspora wallets, voice assistant, loan health, and bookkeeping for SMEs",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seylan Hub",
    description:
      "AI banking for Sri Lanka — diaspora wallets, voice assistant, loan health, and bookkeeping for SMEs",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${geistMono.variable} ${notoSansSinhala.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <AppShell>{children}</AppShell>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
