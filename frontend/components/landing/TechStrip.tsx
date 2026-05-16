import Image from "next/image";

function Divider() {
  return <span className="w-px h-5 bg-seylan-border shrink-0" aria-hidden="true" />;
}

export function TechStrip() {
  return (
    <section className="border-t border-seylan-border bg-seylan-mist py-10 px-6">
      <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
        Powered by
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-4xl mx-auto">
        {/* Seylan Bank */}
        <div className="flex items-center gap-2">
          <Image
            src="/seylan-logo.svg"
            alt="Seylan Bank"
            width={80}
            height={24}
            className="h-6 w-auto opacity-80"
          />
        </div>

        <Divider />

        {/* Groq */}
        <div className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-[#F55036]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="font-mono font-bold text-sm text-[#F55036] tracking-tight">
            Groq
          </span>
        </div>

        <Divider />

        {/* ElevenLabs */}
        <div className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-seylan-charcoal/70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12h3M7 6v12M11 4v16M15 8v8M19 6v12M22 12h1" />
          </svg>
          <span className="font-semibold text-sm text-seylan-charcoal/70 tracking-tight">
            ElevenLabs
          </span>
        </div>

        <Divider />

        {/* Supabase */}
        <div className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-[#3ECF8E]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.111 12.876.706 14.087 1.75 14.087h8.84l.012 8.878c.015.985 1.26 1.409 1.874.636l9.262-11.652c.653-.826.058-2.036-.986-2.036h-8.84L11.9 1.036z" />
          </svg>
          <span className="font-semibold text-sm text-seylan-charcoal/70 tracking-tight">
            Supabase
          </span>
        </div>

        <Divider />

        {/* Vercel */}
        <div className="flex items-center gap-1.5">
          <svg
            className="h-4 w-4 text-seylan-charcoal/70"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 1L24 22H0L12 1z" />
          </svg>
          <span className="font-semibold text-sm text-seylan-charcoal/70 tracking-tight">
            Vercel
          </span>
        </div>
      </div>
    </section>
  );
}
