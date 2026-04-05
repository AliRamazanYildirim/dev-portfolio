export interface SendEmailSecurityConfig {
  rateLimit: {
    ipWindow: {
      limit: number;
      windowSec: number;
    };
    fingerprintWindow: {
      limit: number;
      windowSec: number;
    };
  };
  turnstile: {
    enabled: boolean;
    verifyTimeoutMs: number;
    secretKey: string;
  };
  delivery: {
    maxConcurrent: number;
    maxQueueSize: number;
    circuitFailureThreshold: number;
    circuitOpenSec: number;
  };
}

const DEFAULTS = {
  SEND_EMAIL_IP_WINDOW_LIMIT: 5,
  SEND_EMAIL_IP_WINDOW_SECONDS: 600,
  SEND_EMAIL_FINGERPRINT_WINDOW_LIMIT: 3,
  SEND_EMAIL_FINGERPRINT_WINDOW_SECONDS: 600,
  SEND_EMAIL_TURNSTILE_VERIFY_TIMEOUT_MS: 8000,
  SEND_EMAIL_MAX_CONCURRENT: 2,
  SEND_EMAIL_MAX_QUEUE_SIZE: 50,
  SEND_EMAIL_CIRCUIT_FAILURE_THRESHOLD: 5,
  SEND_EMAIL_CIRCUIT_OPEN_SECONDS: 60,
} as const;

function readPositiveInt(name: keyof typeof DEFAULTS): number {
  const raw = process.env[name];
  const parsed = Number(raw);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULTS[name];
}

function readTurnstileSecret(): string {
  return (
    process.env.SEND_EMAIL_TURNSTILE_SECRET_KEY?.trim() ||
    process.env.TURNSTILE_SECRET_KEY?.trim() ||
    ""
  );
}

export const sendEmailSecurityConfig: SendEmailSecurityConfig = {
  rateLimit: {
    ipWindow: {
      limit: readPositiveInt("SEND_EMAIL_IP_WINDOW_LIMIT"),
      windowSec: readPositiveInt("SEND_EMAIL_IP_WINDOW_SECONDS"),
    },
    fingerprintWindow: {
      limit: readPositiveInt("SEND_EMAIL_FINGERPRINT_WINDOW_LIMIT"),
      windowSec: readPositiveInt("SEND_EMAIL_FINGERPRINT_WINDOW_SECONDS"),
    },
  },
  turnstile: {
    enabled: process.env.SEND_EMAIL_TURNSTILE_ENABLED === "true",
    verifyTimeoutMs: readPositiveInt("SEND_EMAIL_TURNSTILE_VERIFY_TIMEOUT_MS"),
    secretKey: readTurnstileSecret(),
  },
  delivery: {
    maxConcurrent: readPositiveInt("SEND_EMAIL_MAX_CONCURRENT"),
    maxQueueSize: readPositiveInt("SEND_EMAIL_MAX_QUEUE_SIZE"),
    circuitFailureThreshold: readPositiveInt(
      "SEND_EMAIL_CIRCUIT_FAILURE_THRESHOLD",
    ),
    circuitOpenSec: readPositiveInt("SEND_EMAIL_CIRCUIT_OPEN_SECONDS"),
  },
};
