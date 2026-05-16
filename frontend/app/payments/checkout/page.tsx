"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const DEFAULT_MPGS_HOST = "test-seylan.mtf.gateway.mastercard.com";
/** Script path version: MUST stay below 63. Bundles for v63+ only log an error and skip configure(); REST API can still use a higher version (e.g. 79). */
const DEFAULT_MPGS_CHECKOUT_JS_VERSION = "62";

declare global {
  interface Window {
    Checkout?: {
      configure: (config: Record<string, unknown>) => void;
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
            merchant: {
              name: "Seylan Hub",
            },
            displayControl: {
              billingAddress: "HIDE",
            },
          },
        });
        Checkout.showPaymentPage();
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
      script.remove();
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

  const mpgsHost =
    (process.env.NEXT_PUBLIC_MPGS_HOST ?? "").trim() || DEFAULT_MPGS_HOST;
  const checkoutJsVersion =
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
