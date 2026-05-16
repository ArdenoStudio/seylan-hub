import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeylanHub Status",
  description: "Real-time status and uptime for all SeylanHub services.",
  openGraph: {
    title: "SeylanHub Status",
    description: "Real-time status and uptime for all SeylanHub services.",
    siteName: "SeylanHub Status",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
