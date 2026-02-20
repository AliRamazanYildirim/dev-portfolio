/**
 * Admin Customers API – Business Logic / Service Layer
 *
 * SRP-Refactored:
 *  - Welcome-E-Mail → WelcomeEmailService (lib/welcomeEmailService.ts)
 *  - Referral-Logik → processReferral (lib/referralService.ts)
 *  - Recalc-Logik → RecalcService (lib/recalcService.ts)
 *  - Update-UseCase → CustomerUpdateUseCase (lib/updateUseCase.ts)
 *  - DTOs → dto.ts (typ-sichere Mapper)
 *  - Dieser Service: reiner Kunden-CRUD + Orchestrierung
 */

import { customerRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { fetchCustomers } from "./lib/query";
import {
    calcTotalEarnings,
    generateUniqueReferralCode,
} from "./lib/referral";
import { processReferral } from "./lib/referralService";
import { WelcomeEmailService } from "./lib/welcomeEmailService";
import { RecalcService } from "./lib/recalcService";
import { CustomerUpdateUseCase } from "./lib/updateUseCase";
import { toCustomerReadDto } from "./lib/dto";
import type { CustomerReadDto } from "./lib/dto";
import { NotFoundError } from "@/lib/errors";
import type { CreateCustomerRequest, CustomerQueryParams } from "./types";

export class CustomersService {
    /**
     * Alle Kunden mit optionalen Filtern/Sortierung abrufen
     */
    static async list(params: CustomerQueryParams) {
        return fetchCustomers({
            sort: params.sort,
            from: params.from,
            to: params.to,
            q: params.q,
        });
    }

    /**
     * Neuen Kunden erstellen inkl. Referral-Logik + Welcome-Mail
     */
    static async create(input: CreateCustomerRequest): Promise<CustomerReadDto> {
        await connectToMongo();

        const finalPriceForNewCustomer = input.price || 0;

        // ------- Neuen Kunden anlegen -------
        const myReferralCode = await generateUniqueReferralCode();

        const customerData: Record<string, unknown> = {
            firstname: input.firstname || "",
            lastname: input.lastname || "",
            companyname: input.companyname || "",
            email: input.email,
            phone: input.phone || "",
            address: input.address || "",
            city: input.city || null,
            postcode: input.postcode || null,
            reference: input.reference || null,
            price: input.price,
            myReferralCode,
            finalPrice: finalPriceForNewCustomer,
            discountRate: null,
            referralCount: 0,
            createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
            updatedAt: new Date(),
        };

        const rawCustomer = await customerRepository.create({ data: customerData });
        const customer = toCustomerReadDto(rawCustomer as unknown as Record<string, unknown>);

        // ------- Referral-Verarbeitung (delegiert an ReferralService) -------
        if (input.reference && input.price) {
            await processReferral(
                input.reference,
                input.price,
                customer.id,
            );
        }

        // ------- Welcome-Mail senden (delegiert an WelcomeEmailService) -------
        await WelcomeEmailService.send(
            {
                email: customer.email,
                firstname: customer.firstname,
                lastname: customer.lastname,
            },
            input.language || "de",
        );

        return customer;
    }

    /**
     * Einzelnen Kunden anhand der ID abrufen
     */
    static async getById(id: string): Promise<CustomerReadDto | null> {
        await connectToMongo();
        const data = await customerRepository.findUnique({ where: { id } });
        if (!data) return null;

        const dto = toCustomerReadDto(data as unknown as Record<string, unknown>);
        const computedTotalEarnings = calcTotalEarnings(dto.price, dto.referralCount);

        if (Math.abs(dto.totalEarnings - computedTotalEarnings) > 0.009) {
            await customerRepository.update({
                where: { id },
                data: { totalEarnings: computedTotalEarnings, updatedAt: new Date() },
            });
            dto.totalEarnings = computedTotalEarnings;
        }

        return dto;
    }

    /**
     * Kunden aktualisieren inkl. Referral-Logik (delegiert an CustomerUpdateUseCase)
     */
    static async updateById(id: string, body: Record<string, unknown>) {
        return CustomerUpdateUseCase.execute(id, body);
    }

    /**
     * Kunden löschen
     */
    static async deleteById(id: string) {
        await connectToMongo();
        await customerRepository.delete({ where: { id } });
        return { success: true };
    }

    /**
     * FinalPrice neu berechnen (delegiert an RecalcService)
     */
    static async recalcFinalPrice(customerId: string) {
        return RecalcService.recalcFinalPrice(customerId);
    }
}
