/**
 * Admin Customers API – Business Logic / Service Layer
 *
 * SRP-Refactored:
 *  - Kunden-Erstellung → CreateCustomerUseCase (lib/createUseCase.ts)
 *  - Welcome-E-Mail → WelcomeEmailService (lib/welcomeEmailService.ts)
 *  - Referral-Logik → processReferral (lib/referralService.ts)
 *  - Recalc-Logik → RecalcService (lib/recalcService.ts)
 *  - Update-UseCase → CustomerUpdateUseCase (lib/updateUseCase.ts)
 *  - DTOs → dto.ts (typ-sichere Mapper)
 *  - Dieser Service: reiner Kunden-CRUD-Fassade + Orchestrierung
 */

import { customerRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { fetchCustomers } from "./lib/query";
import { calcTotalEarnings } from "./lib/referral";
import { RecalcService } from "./lib/recalcService";
import { CustomerUpdateUseCase } from "./lib/updateUseCase";
import { CreateCustomerUseCase } from "./lib/createUseCase";
import { toCustomerReadDto } from "./lib/dto";
import type { CustomerReadDto } from "./lib/dto";
import type { ICustomer } from "@/models/Customer";
import { NotFoundError } from "@/lib/errors";
import type { CreateCustomerRequest, CustomerQueryParams, UpdateCustomerRequest } from "./types";

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
     * Neuen Kunden erstellen (delegiert an CreateCustomerUseCase)
     */
    static async create(input: CreateCustomerRequest): Promise<CustomerReadDto> {
        return CreateCustomerUseCase.execute(input);
    }

    /**
     * Einzelnen Kunden anhand der ID abrufen
     */
    static async getById(id: string): Promise<CustomerReadDto | null> {
        await connectToMongo();
        const data = await customerRepository.findUnique({ where: { id } });
        if (!data) return null;

        const dto = toCustomerReadDto(data as unknown as ICustomer);
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
    static async updateById(id: string, body: UpdateCustomerRequest) {
        return CustomerUpdateUseCase.execute(id, body as Record<string, unknown>);
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
