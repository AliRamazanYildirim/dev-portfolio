"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type TurnstileWidgetId = string | number;

type TurnstileRenderOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions,
  ) => TurnstileWidgetId;
  remove: (widgetId: TurnstileWidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  disabled: boolean;
  refreshKey: number;
  onTokenChange: (token: string) => void;
}

export default function TurnstileWidget({
  siteKey,
  disabled,
  refreshKey,
  onTokenChange,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (
      !scriptLoaded ||
      !siteKey ||
      !containerRef.current ||
      !window.turnstile
    ) {
      return;
    }

    if (widgetIdRef.current !== null) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    onTokenChange("");

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onTokenChange(token),
      "expired-callback": () => onTokenChange(""),
      "error-callback": () => onTokenChange(""),
    });

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptLoaded, siteKey, refreshKey, onTokenChange]);

  if (!siteKey) {
    return (
      <p className="text-center text-xs text-red-600">
        Security verification is enabled but site key is missing.
      </p>
    );
  }

  return (
    <div
      className={`flex justify-center ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} />
    </div>
  );
}
