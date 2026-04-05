import { createHash } from "crypto";
import { getIpFromHeaders } from "@/lib/ip";
import {
  checkRateLimitKey,
  type RateLimitMeta,
} from "@/lib/mongoRateLimiter";
import {
  sendEmailSecurityConfig,
  type SendEmailSecurityConfig,
} from "./securityConfig";

export type SendEmailRateLimitPolicy =
  | "send_email_ip_window"
  | "send_email_fingerprint_window";

export interface SendEmailRateLimitDecision {
  allowed: boolean;
  policy: SendEmailRateLimitPolicy;
  meta: RateLimitMeta;
}

export interface SendEmailRequestContext {
  ip: string;
  fingerprint: string;
}

function toDecision(
  policy: SendEmailRateLimitPolicy,
  allowed: boolean,
  meta: RateLimitMeta,
): SendEmailRateLimitDecision {
  return { allowed, policy, meta };
}

function pickMostRestrictiveMeta(
  left: RateLimitMeta,
  right: RateLimitMeta,
): RateLimitMeta {
  if (left.remaining !== right.remaining) {
    return left.remaining < right.remaining ? left : right;
  }
  return left.reset < right.reset ? left : right;
}

function buildFingerprint(headers: Headers): string {
  const userAgent = headers.get("user-agent") || "";
  const acceptLanguage = headers.get("accept-language") || "";
  const accept = headers.get("accept") || "";
  const secChUa = headers.get("sec-ch-ua") || "";

  const raw = `${userAgent}|${acceptLanguage}|${accept}|${secChUa}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

function getIpKey(ip: string): string {
  return `send_email:ip:${ip}`;
}

function getFingerprintKey(fingerprint: string): string {
  return `send_email:fingerprint:${fingerprint}`;
}

export function createSendEmailRequestContext(
  headers: Headers,
): SendEmailRequestContext {
  return {
    ip: getIpFromHeaders(headers),
    fingerprint: buildFingerprint(headers),
  };
}

export async function checkSendEmailRateLimit(
  context: SendEmailRequestContext,
  config: SendEmailSecurityConfig = sendEmailSecurityConfig,
): Promise<SendEmailRateLimitDecision> {
  const ipResult = await checkRateLimitKey(
    getIpKey(context.ip),
    config.rateLimit.ipWindow.windowSec,
    config.rateLimit.ipWindow.limit,
  );

  if (!ipResult.allowed) {
    return toDecision("send_email_ip_window", false, ipResult.meta);
  }

  const fingerprintResult = await checkRateLimitKey(
    getFingerprintKey(context.fingerprint),
    config.rateLimit.fingerprintWindow.windowSec,
    config.rateLimit.fingerprintWindow.limit,
  );

  if (!fingerprintResult.allowed) {
    return toDecision(
      "send_email_fingerprint_window",
      false,
      fingerprintResult.meta,
    );
  }

  const meta = pickMostRestrictiveMeta(ipResult.meta, fingerprintResult.meta);
  const policy: SendEmailRateLimitPolicy =
    meta.remaining === fingerprintResult.meta.remaining &&
    meta.reset === fingerprintResult.meta.reset
      ? "send_email_fingerprint_window"
      : "send_email_ip_window";

  return toDecision(policy, true, meta);
}
