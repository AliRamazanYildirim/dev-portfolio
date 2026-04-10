import { getIpFromHeaders } from "@/lib/ip";
import {
    checkRateLimitKey,
    type RateLimitMeta,
} from "@/lib/mongoRateLimiter";

export type ReferralValidateRateLimitPolicy =
    | "referral_validate_ip_window"
    | "referral_validate_code_ip_window";

export interface ReferralValidateRateLimitDecision {
    allowed: boolean;
    policy: ReferralValidateRateLimitPolicy;
    meta: RateLimitMeta;
}

export interface ReferralValidateRequestContext {
    ip: string;
    referralCode: string;
}

interface ReferralValidateSecurityConfig {
    ipWindow: {
        limit: number;
        windowSec: number;
    };
    codeIpWindow: {
        limit: number;
        windowSec: number;
    };
}

const DEFAULTS = {
    REFERRAL_VALIDATE_IP_WINDOW_LIMIT: 20,
    REFERRAL_VALIDATE_IP_WINDOW_SECONDS: 600,
    REFERRAL_VALIDATE_CODE_IP_WINDOW_LIMIT: 8,
    REFERRAL_VALIDATE_CODE_IP_WINDOW_SECONDS: 600,
} as const;

function readPositiveInt(name: keyof typeof DEFAULTS): number {
    const raw = process.env[name];
    const parsed = Number(raw);
    if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
    }
    return DEFAULTS[name];
}

const referralValidateSecurityConfig: ReferralValidateSecurityConfig = {
    ipWindow: {
        limit: readPositiveInt("REFERRAL_VALIDATE_IP_WINDOW_LIMIT"),
        windowSec: readPositiveInt("REFERRAL_VALIDATE_IP_WINDOW_SECONDS"),
    },
    codeIpWindow: {
        limit: readPositiveInt("REFERRAL_VALIDATE_CODE_IP_WINDOW_LIMIT"),
        windowSec: readPositiveInt("REFERRAL_VALIDATE_CODE_IP_WINDOW_SECONDS"),
    },
};

function toDecision(
    policy: ReferralValidateRateLimitPolicy,
    allowed: boolean,
    meta: RateLimitMeta,
): ReferralValidateRateLimitDecision {
    return { allowed, policy, meta };
}

function pickMostRestrictiveMeta(left: RateLimitMeta, right: RateLimitMeta): RateLimitMeta {
    if (left.remaining !== right.remaining) {
        return left.remaining < right.remaining ? left : right;
    }

    return left.reset < right.reset ? left : right;
}

function getIpKey(ip: string): string {
    return `referral_validate:ip:${ip}`;
}

function getCodeIpKey(referralCode: string, ip: string): string {
    return `referral_validate:code:${referralCode}:ip:${ip}`;
}

export function createReferralValidateRequestContext(
    headers: Headers,
    referralCode: string,
): ReferralValidateRequestContext {
    return {
        ip: getIpFromHeaders(headers),
        referralCode: referralCode.toLowerCase(),
    };
}

export async function checkReferralValidateRateLimit(
    context: ReferralValidateRequestContext,
): Promise<ReferralValidateRateLimitDecision> {
    const ipResult = await checkRateLimitKey(
        getIpKey(context.ip),
        referralValidateSecurityConfig.ipWindow.windowSec,
        referralValidateSecurityConfig.ipWindow.limit,
    );

    if (!ipResult.allowed) {
        return toDecision("referral_validate_ip_window", false, ipResult.meta);
    }

    const codeIpResult = await checkRateLimitKey(
        getCodeIpKey(context.referralCode, context.ip),
        referralValidateSecurityConfig.codeIpWindow.windowSec,
        referralValidateSecurityConfig.codeIpWindow.limit,
    );

    if (!codeIpResult.allowed) {
        return toDecision("referral_validate_code_ip_window", false, codeIpResult.meta);
    }

    const meta = pickMostRestrictiveMeta(ipResult.meta, codeIpResult.meta);
    const policy: ReferralValidateRateLimitPolicy =
        meta.remaining === codeIpResult.meta.remaining &&
            meta.reset === codeIpResult.meta.reset
            ? "referral_validate_code_ip_window"
            : "referral_validate_ip_window";

    return toDecision(policy, true, meta);
}
