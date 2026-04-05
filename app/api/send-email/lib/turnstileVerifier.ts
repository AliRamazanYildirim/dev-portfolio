import { ForbiddenError } from "@/lib/errors";
import {
  sendEmailSecurityConfig,
  type SendEmailSecurityConfig,
} from "./securityConfig";
import type { SendEmailRequestContext } from "./rateLimit";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerificationResult = {
  success: boolean;
};

function parseTurnstilePayload(payload: unknown): TurnstileVerificationResult {
  if (!payload || typeof payload !== "object") {
    return { success: false };
  }

  const raw = payload as { success?: unknown };
  return { success: raw.success === true };
}

export async function verifySendEmailTurnstile(
  context: SendEmailRequestContext,
  token: string | undefined,
  config: SendEmailSecurityConfig = sendEmailSecurityConfig,
): Promise<void> {
  if (!config.turnstile.enabled) {
    return;
  }

  const secret = config.turnstile.secretKey;
  if (!secret) {
    throw new Error(
      "SEND_EMAIL_TURNSTILE_SECRET_KEY (or TURNSTILE_SECRET_KEY) is required when SEND_EMAIL_TURNSTILE_ENABLED=true",
    );
  }

  if (!token) {
    throw new ForbiddenError("Security verification failed");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    config.turnstile.verifyTimeoutMs,
  );

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      remoteip: context.ip,
    });

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Turnstile verify failed: HTTP ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const verifyResult = parseTurnstilePayload(payload);
    if (!verifyResult.success) {
      throw new ForbiddenError("Security verification failed");
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
