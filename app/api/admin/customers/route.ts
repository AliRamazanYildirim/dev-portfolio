import { CustomersService } from "./service";
import { validateCreateCustomerBody } from "./validation";
import { successResponse, handleError } from "@/lib/api-response";
import { ValidationError, ConflictError } from "@/lib/errors";

/**
 * GET /api/admin/customers
 * Query params: sort, from, to, q
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await CustomersService.list({
      sort: searchParams.get("sort"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      q: searchParams.get("q"),
    });
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/admin/customers — Neuen Kunden hinzufügen
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Input validieren
    const validation = validateCreateCustomerBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    // 2. Service aufrufen
    const customer = await CustomersService.create(validation.value);
    return successResponse(customer);
  } catch (err: unknown) {
    // Duplicate-Key → 409
    if (err instanceof Error) {
      const msg = err.message;
      if (
        msg.includes("duplicate key value") ||
        msg.includes("unique constraint") ||
        (err as any)?.code === 11000
      ) {
        return handleError(
          new ConflictError(
            "This email address is already registered. Each customer must have a unique email address.",
          ),
        );
      }
    }
    return handleError(err);
  }
}
