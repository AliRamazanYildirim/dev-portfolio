import { CustomerByIdService } from "./service";
import { validateCustomerId, validateUpdateBody } from "./validation";
import { successResponse, handleError } from "@/lib/api-response";
import { NotFoundError, ValidationError } from "@/lib/errors";

// GET: Einzelnen Kunden abrufen
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = validateCustomerId((await context.params).id);
    const data = await CustomerByIdService.getById(id);

    if (!data) {
      throw new NotFoundError("Customer not found");
    }

    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}

// PUT: Kunden aktualisieren
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = validateCustomerId((await context.params).id);
    const body = await req.json();

    const validation = validateUpdateBody(body);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    const result = await CustomerByIdService.updateById(id, validation.value);
    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: Kunden löschen
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = validateCustomerId((await context.params).id);
    await CustomerByIdService.deleteById(id);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
