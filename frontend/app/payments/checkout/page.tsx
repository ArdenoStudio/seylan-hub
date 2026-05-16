"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const DEFAULT_MPGS_HOST = "test-seylan.mtf.gateway.mastercard.com";
/** The checkout.js path version must match the REST version used to create the MPGS session. */
const DEFAULT_MPGS_CHECKOUT_JS_VERSION = "79";

const MPGS_SESSION_STORAGE_PREFIX = "HostedCheckout";

/** MPGS stores resume flags in sessionStorage; stale keys make showLightbox() short-circuit without opening the UI. */
function clearMpgsHostedCheckoutBrowserState(): void {
  if (typeof window === "undefined") return;
  try {
    for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
      const key = window.sessionStorage.key(i);
      if (key && key.startsWith(MPGS_SESSION_STORAGE_PREFIX)) {
        window.sessionStorage.removeItem(key);
      }
    }
  } catch {
    /* storage unavailable */
  }
}

declare global {
  interface Window {
    Checkout?: {
      configure: (config: Record<string, unknown>) => void;
      /** Modal Hosted Checkout — sends configure to the gateway iframe (required on this MPGS build). */
      showLightbox: () => void;
      /** Full-page mode only works after the lightbox iframe bridge exists; prefer showLightbox. */
      showPaymentPage: () => void;
    };
  }
}

function MissingCheckoutParams() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-seylan-mist px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
        <h1 className="text-lg font-semibold text-seylan-charcoal">Checkout unavailable</h1>
        <p className="text-sm text-muted-foreground">
          Missing payment session. Please start again from the payment button in the app.
        </p>
        <Link
          href="/wallet"
          className="inline-block w-full rounded-lg bg-seylan-plum px-4 py-2 text-sm font-medium text-white hover:bg-seylan-red transition-colors"
        >
          Back to wallet
        </Link>
      </div>
    </div>
  );
}

function HostedCheckoutLoader({
  sessionId,
  merchantId,
  mpgsHost,
  checkoutJsVersion,
}: {
  sessionId: string;
  merchantId: string;
  mpgsHost: string;
  checkoutJsVersion: string;
}) {
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const scriptSrc = `https://${mpgsHost}/checkout/version/${checkoutJsVersion}/checkout.js`;

    clearMpgsHostedCheckoutBrowserState();

    function startHostedCheckout() {
      if (cancelled) return;
      const Checkout = window.Checkout;
      if (!Checkout) {
        setLoadError("Payment gateway did not load. Please try again.");
        return;
      }
      try {
        Checkout.configure({
          merchant: merchantId,
          session: { id: sessionId },
          interaction: {
            operation: "PURCHASE",
            merchant: {
              name: "Seylan Hub",
            },
            displayControl: {
              billingAddress: "HIDE",
            },
          },
        });
        // After configure, showLightbox must run when configuration is non-empty and shouldResumeSession() is false.
        window.setTimeout(() => {
          if (cancelled) return;
          try {
            Checkout.showLightbox();
          } catch (e) {
            console.error(e);
            setLoadError("Could not open payment window. Please try again.");
          }
        }, 120);
      } catch (e) {
        console.error(e);
        setLoadError("Could not start checkout. Please try again.");
      }
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => startHostedCheckout();
    script.onerror = () => {
      if (!cancelled) {
        setLoadError("Failed to load payment gateway. Check your connection and try again.");
      }
    };
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [sessionId, merchantId, mpgsHost, checkoutJsVersion]);

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-seylan-mist px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
          <h1 className="text-lg font-semibold text-seylan-charcoal">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">{loadError}</p>
          <Link
            href="/wallet"
            className="inline-block w-full rounded-lg bg-seylan-plum px-4 py-2 text-sm font-medium text-white hover:bg-seylan-red transition-colors"
          >
            Back to wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-seylan-mist px-4 gap-4">
      <div className="h-10 w-10 rounded-full border-4 border-seylan-plum border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground text-center">
        Opening secure Mastercard checkout&hellip;
      </p>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";
  const merchantId = searchParams.get("merchant") ?? "";
  const versionParam = searchParams.get("version") ?? "";

  const mpgsHost =
    (process.env.NEXT_PUBLIC_MPGS_HOST ?? "").trim() || DEFAULT_MPGS_HOST;
  const checkoutJsVersion =
    versionParam.trim() ||
    (process.env.NEXT_PUBLIC_MPGS_CHECKOUT_JS_VERSION ?? "").trim() ||
    DEFAULT_MPGS_CHECKOUT_JS_VERSION;

  if (!sessionId || !merchantId) {
    return <MissingCheckoutParams />;
  }

  return (
    <HostedCheckoutLoader
      sessionId={sessionId}
      merchantId={merchantId}
      mpgsHost={mpgsHost}
      checkoutJsVersion={checkoutJsVersion}
    />
  );
}

export default function PaymentsCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-seylan-mist">
          <div className="h-10 w-10 rounded-full border-4 border-seylan-plum border-t-transparent animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
