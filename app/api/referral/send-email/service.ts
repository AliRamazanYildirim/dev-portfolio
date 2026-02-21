import { customerRepository } from "@/lib/repositories";
import { getDiscountsEnabled } from "@/lib/discountSettings";
import { NotFoundError, ConflictError, ValidationError } from "@/lib/errors";
import { buildReferralEmailTemplate } from "./lib/template";
import { getReferralNotifier } from "@/lib/notifications";
import { toCustomerReadDto } from "@/app/api/admin/customers/lib/dto";
import type { SendReferralEmailInput, SendReferralEmailResult } from "./types";

export class ReferralEmailService {
    static async send(input: SendReferralEmailInput): Promise<SendReferralEmailResult> {
        const { customerId, customerEmail } = input;

        if (!customerId) {
            throw new ValidationError("Customer ID is required");
        }

        const discountsEnabled = await getDiscountsEnabled();
        if (!discountsEnabled) {
            throw new ConflictError("Discounts are disabled");
        }

        const customer = await customerRepository.findUnique({ where: { id: customerId } });
        if (!customer) {
            throw new NotFoundError("Customer not found");
        }

        const cust = toCustomerReadDto(customer);

        const referralCode = cust.myReferralCode;
        if (!referralCode) {
            throw new NotFoundError("Customer does not have a referral code");
        }

        const { subject, html } = buildReferralEmailTemplate({
            firstName: cust.firstname,
            lastName: cust.lastname,
            referralCode,
            referralCount: cust.referralCount,
            referrerPrice: cust.price,
        });

        const toAddress = customerEmail || cust.email;
        if (!toAddress) {
            throw new ValidationError("No recipient email provided");
        }

        // Mail über Notification Port senden (DIP)
        const notifier = getReferralNotifier();
        await notifier.sendReferralInfo({ to: toAddress, subject, html });

        return {
            referralCode,
            customerName: `${cust.firstname} ${cust.lastname}`,
            customerEmail: toAddress,
            sent: true,
        };
    }
}
