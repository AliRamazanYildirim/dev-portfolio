import { customerRepository } from "@/lib/repositories";
import { getDiscountsEnabled } from "@/lib/discountSettings";
import { NotFoundError, ConflictError, ValidationError } from "@/lib/errors";
import { buildReferralEmailTemplate } from "./lib/template";
import { sendReferralEmail } from "./lib/mailer";

interface SendReferralEmailInput {
    customerId: string;
    customerEmail?: string;
}

interface SendReferralEmailResult {
    referralCode: string;
    customerName: string;
    customerEmail: string;
    messageId: string;
    previewUrl: string | false | null;
}

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

        const cust = customer as unknown as Record<string, unknown>;

        const referralCode = cust.myReferralCode as string | undefined;
        if (!referralCode) {
            throw new NotFoundError("Customer does not have a referral code");
        }

        const firstname = (cust.firstname as string) ?? "";
        const lastname = (cust.lastname as string) ?? "";
        const referralCount = (cust.referralCount as number) ?? 0;
        const price = (cust.price as number) ?? 0;

        const { subject, html } = buildReferralEmailTemplate({
            firstName: firstname,
            lastName: lastname,
            referralCode,
            referralCount,
            referrerPrice: price,
        });

        const toAddress = customerEmail || (cust.email as string);
        if (!toAddress) {
            throw new ValidationError("No recipient email provided");
        }

        const { messageId, previewUrl } = await sendReferralEmail({
            to: toAddress,
            subject,
            html,
        });

        return {
            referralCode,
            customerName: `${firstname} ${lastname}`,
            customerEmail: toAddress,
            messageId,
            previewUrl,
        };
    }
}
