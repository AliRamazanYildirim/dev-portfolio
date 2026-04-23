/**
 * TypeScript-Ambient-Deklaration fuer die JS-Implementation in `headers.mjs`.
 */

export interface SecurityHeader {
    key: string;
    value: string;
}

export function buildSecurityHeaders(
    env?: NodeJS.ProcessEnv,
    options?: { nonce?: string },
): SecurityHeader[];
