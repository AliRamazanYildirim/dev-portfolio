import { validateRecalcBody } from "../validation";
import type { RecalcFinalRequest } from "./types";

export function validateBody(
    body: unknown,
): { valid: true; value: RecalcFinalRequest } | { valid: false; error: string } {
    return validateRecalcBody(body);
}
