/**
 * Contact – Root utils facade.
 * Re-exportiert Rate-Limit-Helfer aus lib/ für einheitlichen Domain-Root-Zugriff.
 */
export { attachRateLimitHeaders, rateLimitedResponse } from "./lib/utils";
