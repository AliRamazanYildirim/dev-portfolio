import { Customer } from "./customerService";
import { InvoiceData } from "@/lib/invoice-utils";
import { INVOICE_CONSTANTS } from "@/constants/invoice";

export class InvoiceService {
  /**
   * Generates a unique invoice number
   */
  private static generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const randomId = Math.random().toString(36).substr(2, 4).toUpperCase();

    return `INV-${year}${month}${day}-${randomId}`;
  }

  /**
   * Calculates due date based on payment terms
   */
  private static calculateDueDate(): string {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + INVOICE_CONSTANTS.PAYMENT_TERMS_DAYS);
    return dueDate.toLocaleDateString("de-DE");
  }

  /**
   * Calculates pricing information according to German tax system (19% MwSt)
   */
  private static calculatePricing(customer: Customer) {
    const originalPrice = Number(customer.price || 1000);
    const discountRate = Number(customer.discountRate || 0);

    // Calculate net amount (after discount, before MwSt)
    const referralDiscount =
      discountRate > 0 ? (originalPrice * discountRate) / 100 : 0;
    const nettoAmount = originalPrice - referralDiscount; // Netto (MwSt-frei)

    // Calculate 19% MwSt on net amount
    const mwst = nettoAmount * INVOICE_CONSTANTS.VAT_RATE; // 19% MwSt

    // Calculate total (Brutto = Netto + MwSt)
    const bruttoTotal = nettoAmount + mwst;

    return {
      subtotal: originalPrice, // Original price before discount
      referralDiscount, // Discount amount
      referralDiscountPercent: discountRate, // Discount percentage
      netAmount: nettoAmount, // Net amount (after discount, before MwSt)
      vat: mwst, // 19% MwSt amount
      vatPercent: INVOICE_CONSTANTS.VAT_RATE * 100, // 19.00%
      total: bruttoTotal, // Brutto total (Netto + MwSt)
    };
  }

  /**
   * Creates invoice data from customer information
   */
  private static createInvoiceData(customer: Customer): InvoiceData {
    const pricing = this.calculatePricing(customer);

    return {
      invoiceNumber: this.generateInvoiceNumber(),
      issueDate: new Date().toLocaleDateString("de-DE"),
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
        email: customer.email,
        phone: customer.phone || undefined,
      },
      project: {
        title: INVOICE_CONSTANTS.PROJECT.DEFAULT_TITLE,
        description: INVOICE_CONSTANTS.PROJECT.DEFAULT_DESCRIPTION,
        technologies: INVOICE_CONSTANTS.PROJECT.DEFAULT_TECHNOLOGIES[0], // İlk teknoloji string'ini al
        deliverables: [...INVOICE_CONSTANTS.PROJECT.DEFAULT_DELIVERABLES],
        category: INVOICE_CONSTANTS.PROJECT.DEFAULT_CATEGORY[0], // İlk kategoriyi al
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
    customer: Customer
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
