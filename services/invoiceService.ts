import type { Customer } from "@/types/customer";
import { InvoiceData } from "@/lib/invoiceUtils";
import { INVOICE_CONSTANTS } from "@/constants/invoice";
import { calcDiscountedPrice } from "@/app/api/admin/customers/lib/referral";

export class InvoiceService {
  /**
   * Generates a unique invoice number
   */
  private static generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    // `substr` is legacy/deprecated; use `slice` (or `substring`) instead
    const randomId = Math.random().toString(36).slice(2, 6).toUpperCase();

    return `INV-${year}${month}${day}-${randomId}`;
  }

  /**
   * Calculates due date based on payment terms
   */
  private static calculateDueDate(): string {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + INVOICE_CONSTANTS.PAYMENT_TERMS_DAYS);
    return dueDate.toISOString();
  }

  /**
   * Calculates pricing information according to German tax system (19% MwSt)
   * Uses 3-stage discount system (3-6-9%) + 3% bonus per additional referral
   * Prices are treated as NET (VAT exclusive)
   */
  private static calculatePricing(customer: Customer) {
    const originalNetPrice = Number(customer.price || 1000); // Original net price (VAT exclusive)
    const referralCount = Number(customer.referralCount || 0);

    // Calculate discounted price using 3-stage system:
    // - 1st referral: 3% discount
    // - 2nd referral: additional 3% (cumulative 6%)
    // - 3rd referral: additional 3% (cumulative 9%)
    // - 4th+ referrals: additional 3% bonus each (cumulative 12%, 15%, etc.)
    const netAmountAfterDiscount = calcDiscountedPrice(originalNetPrice, referralCount);

    // Calculate total discount amount
    const referralDiscount = originalNetPrice - netAmountAfterDiscount;

    // Calculate effective discount percentage
    const effectiveDiscountPercent = originalNetPrice > 0
      ? (referralDiscount / originalNetPrice) * 100
      : 0;

    // Calculate 19% MwSt on net amount after discount
    const mwst = netAmountAfterDiscount * INVOICE_CONSTANTS.VAT_RATE; // 19% MwSt

    // Calculate total (Brutto = Netto + MwSt)
    const bruttoTotal = netAmountAfterDiscount + mwst;

    return {
      subtotal: originalNetPrice, // Original net price before discount (VAT exclusive)
      referralDiscount, // Total discount amount
      referralDiscountPercent: Math.round(effectiveDiscountPercent * 100) / 100, // Effective discount percentage
      netAmount: netAmountAfterDiscount, // Net amount after discount (VAT exclusive)
      vat: mwst, // 19% MwSt amount
      vatPercent: INVOICE_CONSTANTS.VAT_RATE * 100, // 19.00%
      total: bruttoTotal, // Brutto total (Netto + MwSt)
    };
  }

  /**
   * Creates invoice data from customer information
   */
  static createInvoiceData(
    customer: Customer,
    projectOverrides?: {
      category?: string;
      deliverables?: string[];
      title?: string;
      description?: string;
      duration?: string;
    },
  ): InvoiceData {
    const pricing = this.calculatePricing(customer);

    return {
      invoiceNumber: this.generateInvoiceNumber(),
      issueDate: new Date().toISOString(),
      dueDate: this.calculateDueDate(),
      paymentTerms: `${INVOICE_CONSTANTS.PAYMENT_TERMS_DAYS} days`,
      from: {
        name: INVOICE_CONSTANTS.COMPANY.NAME,
        address: INVOICE_CONSTANTS.COMPANY.ADDRESS,
        city: INVOICE_CONSTANTS.COMPANY.CITY,
        country: INVOICE_CONSTANTS.COMPANY.COUNTRY,
        email: INVOICE_CONSTANTS.COMPANY.EMAIL,
        phone: INVOICE_CONSTANTS.COMPANY.PHONE,
      },
      billTo: {
        name: `${customer.firstname} ${customer.lastname}`,
        company: customer.companyname || undefined,
        address: customer.address,
        city: customer.city || undefined,
        postcode: customer.postcode || undefined,
        email: customer.email,
        phone: customer.phone || undefined,
      },
      project: {
        title:
          projectOverrides?.title || INVOICE_CONSTANTS.PROJECT.DEFAULT_TITLE,
        description:
          projectOverrides?.description ||
          INVOICE_CONSTANTS.PROJECT.DEFAULT_DESCRIPTION,
        technologies: INVOICE_CONSTANTS.PROJECT.DEFAULT_TECHNOLOGIES[0], // İlk teknoloji string'ini al
        deliverables: projectOverrides?.deliverables || [
          ...INVOICE_CONSTANTS.PROJECT.DEFAULT_DELIVERABLES,
        ],
        category:
          projectOverrides?.category ||
          INVOICE_CONSTANTS.PROJECT.DEFAULT_CATEGORY[0], // İlk kategoriyi al
        duration:
          projectOverrides?.duration ||
          INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION[0], // İlk duration'ı al
        amount: pricing.netAmount, // Use calculated net amount (after discount, before MwSt)
      },
      pricing,
      paymentInfo: {
        iban: INVOICE_CONSTANTS.COMPANY.IBAN,
        accountHolder: INVOICE_CONSTANTS.COMPANY.NAME,
        reference: INVOICE_CONSTANTS.PAYMENT.DEFAULT_REFERENCE[0], // İlk referans string'ini al
      },
    };
  }

  /**
   * Downloads the generated PDF
   */
  private static async downloadPdf(
    blob: Blob,
    customer: Customer,
  ): Promise<void> {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${customer.firstname}-${customer.lastname}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }

  /**
   * Generates and downloads an invoice PDF for the given customer
   */
  public static async generateInvoice(customer: Customer): Promise<void> {
    const invoiceData = this.createInvoiceData(customer);

    const response = await fetch(INVOICE_CONSTANTS.API.GENERATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate PDF: ${errorText}`);
    }

    const blob = await response.blob();
    await this.downloadPdf(blob, customer);
  }
}
