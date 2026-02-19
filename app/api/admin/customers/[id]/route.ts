import { CustomersService } from "@/app/api/admin/customers/service";
import { successResponse, handleError } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

// GET: Einzelnen Kunden abrufen
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await CustomersService.getById(id);

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
    const { id } = await context.params;
    const body = await req.json();
    const result = await CustomersService.updateById(id, body);
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
    const { id } = await context.params;
    await CustomersService.deleteById(id);
    return successResponse({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
