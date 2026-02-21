import { validateSendDiscountEmailBody } from "../validation";
import type { SendEmailRequest } from "./types";

export function validateBody(body: unknown): SendEmailRequest {
    return validateSendDiscountEmailBody(body);
}
