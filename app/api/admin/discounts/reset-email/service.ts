import { DiscountEmailService } from "../service";
import type { ResetEmailRequest } from "./types";

export class ResetDiscountEmailService {
    static execute(input: ResetEmailRequest) {
        return DiscountEmailService.resetEmail(input.transactionId, input.sendCorrectionEmail);
    }
}
