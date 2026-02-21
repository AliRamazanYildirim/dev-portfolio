import { validateResetDiscountEmailBody } from "../validation";
import type { ResetEmailRequest } from "./types";

export function validateBody(body: unknown): ResetEmailRequest {
    return validateResetDiscountEmailBody(body);
}
