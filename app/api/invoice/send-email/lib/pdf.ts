import { InvoiceGenerateService } from "@/app/api/invoice/generate/service";
import { validateInvoiceData } from "@/app/api/invoice/generate/validation";
import { ValidationError } from "@/lib/errors";
import type { InvoiceData } from "@/lib/invoiceUtils";

export async function fetchInvoicePdf(invoiceData: InvoiceData): Promise<Buffer> {
    const validation = validateInvoiceData(invoiceData);
    if (!validation.valid) {
        throw new ValidationError(validation.error);
    }

    const { pdfBytes } = InvoiceGenerateService.generate(validation.value);
    return Buffer.from(pdfBytes);
}
