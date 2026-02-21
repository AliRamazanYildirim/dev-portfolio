/**
 * Customer Create Use-Case – Kunden-Erstellung als eigenständiger Use-Case (SRP).
 *
 * Extrahiert aus CustomersService.create() (SRP-Fix):
 *  1. Kunden-Daten vorbereiten & persistieren
 *  2. Referral verarbeiten (delegiert an processReferral)
 *  3. Welcome-Mail senden (delegiert an WelcomeEmailService)
 *
 * Der Service bleibt reiner Orchestrierer/Fassade.
 */

import { customerRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { generateUniqueReferralCode } from "./referral";
import { processReferral } from "./referralService";
import { WelcomeEmailService } from "./welcomeEmailService";
import { toCustomerReadDto, type CustomerReadDto } from "./dto";
import type { CreateCustomerRequest } from "../types";

/* ================================================================
 * TYPES
 * ================================================================ */

/** Internes DTO für die Kunden-Persistenz (keine unknown-Maps) */
interface NewCustomerData {
    firstname: string;
    lastname: string;
    companyname: string;
    email: string;
    phone: string;
    address: string;
    city: string | null;
    postcode: string | null;
    reference: string | null;
    price: number;
    myReferralCode: string;
    finalPrice: number;
    discountRate: null;
    referralCount: 0;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: unknown;
}

/* ================================================================
 * USE-CASE
 * ================================================================ */

export class CreateCustomerUseCase {
    /**
     * Phase 1: Kunden-Daten vorbereiten (pure – keine Seiteneffekte).
     */
    private static async prepareCustomerData(
        input: CreateCustomerRequest,
    ): Promise<NewCustomerData> {
        const myReferralCode = await generateUniqueReferralCode();

        return {
            firstname: input.firstname || "",
            lastname: input.lastname || "",
            companyname: input.companyname || "",
            email: input.email,
            phone: input.phone || "",
            address: input.address || "",
            city: input.city ?? null,
            postcode: input.postcode ?? null,
            reference: input.reference ?? null,
            price: input.price,
            myReferralCode,
            finalPrice: input.price || 0,
            discountRate: null,
            referralCount: 0,
            createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
            updatedAt: new Date(),
        };
    }

    /**
     * Vollständiger Kunden-Erstellungs-Flow:
     *  1. Daten vorbereiten
     *  2. Kunden in DB erstellen
     *  3. Referral verarbeiten (optional)
     *  4. Welcome-Mail senden
     */
    static async execute(input: CreateCustomerRequest): Promise<CustomerReadDto> {
        await connectToMongo();

        // 1. Daten vorbereiten
        const customerData = await this.prepareCustomerData(input);

        // 2. Kunden persistieren
        const rawCustomer = await customerRepository.create({ data: customerData });
        const customer = toCustomerReadDto(rawCustomer);

        // 3. Referral verarbeiten (if applicable)
        if (input.reference && input.price) {
            await processReferral(input.reference, input.price, customer.id);
        }

        // 4. Welcome-Mail senden
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
}
