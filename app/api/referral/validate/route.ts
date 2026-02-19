import { validateReferral } from "./service";
import { getDiscountsEnabled } from "@/lib/discountSettings";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError, ConflictError } from "@/lib/errors";

// Route handler delegates to service for validation and discount calculation
export async function POST(request: Request) {
  try {
    const { referralCode, basePrice } = await request.json();

    if (!referralCode || basePrice === undefined || basePrice === null) {
      throw new ValidationError("Referral code and base price are required");
    }

    const discountsEnabled = await getDiscountsEnabled();
    if (!discountsEnabled) {
      throw new ConflictError("Discounts are disabled");
    }

    const numericBasePrice = Number(basePrice);
    if (Number.isNaN(numericBasePrice)) {
      throw new ValidationError("Base price must be a number");
    }

    const result = await validateReferral({
      referralCode,
      basePrice: numericBasePrice,
    });

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
