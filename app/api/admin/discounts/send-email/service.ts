import { DiscountEmailService } from "../service";
import type { SendEmailRequest } from "./types";

export class SendDiscountEmailService {
    static execute(input: SendEmailRequest) {
        return DiscountEmailService.sendEmail(input.transactionId, input.discountRate);
    }
}
