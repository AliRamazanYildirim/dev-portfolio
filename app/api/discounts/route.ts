import { NextRequest } from "next/server";
import { DiscountsService } from "./service";
import {
  parseStatusFilter,
  validateDeleteDiscountBody,
  validatePatchDiscountBody,
} from "./validation";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError, NotFoundError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const status = parseStatusFilter(request.nextUrl.searchParams.get("status"));
    const data = await DiscountsService.listDiscounts(status);
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validatePatchDiscountBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const updated = await DiscountsService.updateDiscount(validation.value);
    if (!updated) {
      throw new NotFoundError("Discount transaction not found");
    }

    return successResponse(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateDeleteDiscountBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const deleted = await DiscountsService.deleteDiscount(validation.value.id);
    if (!deleted) {
      throw new NotFoundError("Discount transaction not found");
    }

    return successResponse(deleted);
  } catch (error) {
    return handleError(error);
  }
}
