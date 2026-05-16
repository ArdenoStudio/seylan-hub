import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F8FA",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: "#C8102E",
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#FFFFFF", fontSize: 40, fontWeight: 700 }}>
            S
          </span>
        </div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#1A1A2E",
            margin: 0,
            marginBottom: 12,
          }}
        >
          Seylan Hub
        </h1>
        <p
          style={{
            fontSize: 22,
            color: "#6B7280",
            margin: 0,
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          AI banking for Sri Lanka — diaspora wallets, voice assistant, loan
          health & bookkeeping for SMEs
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
            fontSize: 14,
            color: "#C8102E",
          }}
        >
          <span>Next.js 15</span>
          <span>•</span>
          <span>Groq AI</span>
          <span>•</span>
          <span>Supabase Realtime</span>
          <span>•</span>
          <span>Cursor Buildathon 2026</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
