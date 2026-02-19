import { NextRequest } from "next/server";
import { DiscountsService } from "./lib/service";
import {
  parseStatusFilter,
  validateDeleteDiscountBody,
  validatePatchDiscountBody,
} from "./lib/validation";
import { errorResponse, successResponse } from "./lib/utils";

export async function GET(request: NextRequest) {
  try {
    const status = parseStatusFilter(request.nextUrl.searchParams.get("status"));
    const data = await DiscountsService.listDiscounts(status);
    return successResponse(data);
  } catch (error) {
    console.error("Failed to load discounts:", error);
    return errorResponse("Failed to load referral discounts", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validatePatchDiscountBody(body);
    if (!validation.valid) {
      return errorResponse(validation.error, 400);
    }

    const updated = await DiscountsService.updateDiscount(validation.value);
    if (!updated) {
      return errorResponse("Discount transaction not found", 404);
    }

    return successResponse(updated);
  } catch (error) {
    console.error("Failed to update discount status:", error);
    return errorResponse("Failed to update discount status", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateDeleteDiscountBody(body);
    if (!validation.valid) {
      return errorResponse(validation.error, 400);
    }

    const deleted = await DiscountsService.deleteDiscount(validation.value.id);
    if (!deleted) {
      return errorResponse("Discount transaction not found", 404);
    }

    return successResponse(deleted);
  } catch (error) {
    console.error("Failed to delete discount record:", error);
    return errorResponse("Failed to delete discount record", 500);
  }
}
