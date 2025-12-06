import { InvoiceData } from "@/lib/invoice-utils";

interface InvoiceDateResult {
    issueDateFormatted: string;
    dueDateFormatted: string;
}

function parseToDate(input: unknown): Date | null {
    if (input === null || input === undefined) {
        return null;
    }

    if (input instanceof Date) {
        return Number.isNaN(input.getTime()) ? null : input;
    }

    if (typeof input === "number") {
        const dateFromNumber = new Date(input);
        return Number.isNaN(dateFromNumber.getTime()) ? null : dateFromNumber;
    }

    if (typeof input === "string") {
        const trimmed = input.trim();

        const isoCandidate = new Date(trimmed);
        if (!Number.isNaN(isoCandidate.getTime())) {
            return isoCandidate;
        }

        const match = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        if (match) {
            const day = Number(match[1]);
            const month = Number(match[2]) - 1;
            const year = Number(match[3]);
            const manualDate = new Date(year, month, day);
            return Number.isNaN(manualDate.getTime()) ? null : manualDate;
        }
    }

    return null;
}

function formatDateDE(date: Date): string {
    return date.toLocaleDateString("de-DE");
}

export function resolveInvoiceDates(invoiceData: InvoiceData): InvoiceDateResult {
    const issueDate = parseToDate(invoiceData.issueDate) ?? new Date();
    const dueDate =
        parseToDate(invoiceData.dueDate) ??
        new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
        issueDateFormatted: formatDateDE(issueDate),
        dueDateFormatted: formatDateDE(dueDate),
    };
}
