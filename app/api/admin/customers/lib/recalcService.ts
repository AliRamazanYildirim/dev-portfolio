/**
 * Recalc Service – Eigenständiger Service für FinalPrice-Neuberechnung.
 *
 * SRP-Fix: Recalc-Logik aus CustomersService extrahiert.
 */

import { customerRepository } from "@/lib/repositories";
import { connectToMongo } from "@/lib/mongodb";
import { calcDiscountedPrice, calcTotalEarnings } from "./referral";
import { NotFoundError } from "@/lib/errors";

export interface RecalcResult {
    id: string;
    finalPrice: number;
    totalEarnings: number;
}

export class RecalcService {
    /**
     * FinalPrice und TotalEarnings eines Kunden neu berechnen.
     */
    static async recalcFinalPrice(customerId: string): Promise<RecalcResult> {
        await connectToMongo();
        const customer = await customerRepository.findByIdExec(customerId);
        if (!customer) {
            throw new NotFoundError("Customer not found");
        }

        const doc = customer as unknown as Record<string, unknown>;
        const basePrice = typeof doc.price === "number" ? Number(doc.price) : 0;
        const refCount = typeof doc.referralCount === "number" ? Number(doc.referralCount) : 0;

        const newFinal = calcDiscountedPrice(basePrice, refCount);
        const totalEarnings = calcTotalEarnings(basePrice, refCount);

        await customerRepository.update({
            where: { id: String(doc._id) },
            data: { finalPrice: newFinal, totalEarnings, updatedAt: new Date() },
        });

        return { id: String(doc._id), finalPrice: newFinal, totalEarnings };
    }
}
