import { InvoiceData } from "@/lib/invoice-utils";

export async function fetchInvoicePdf(invoiceData: InvoiceData): Promise<Buffer> {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/invoice/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
        throw new Error(
            `Failed to generate PDF: ${response.status} ${response.statusText}`
        );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}
