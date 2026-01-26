// Define the data structure for the invoice (jsPDF route için)
export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms?: string;
  from?: {
    name: string;
    address: string;
    city: string;
    country: string;
    email: string;
    phone: string;
  };
  billTo?: {
    name: string;
    company?: string;
    address: string;
    city?: string;
    postcode?: string;
    email: string;
    phone?: string;
  };
  project?: {
    title: string;
    description: string;
    technologies?: string;
    deliverables?: string[];
    category?: string;
    duration?: string;
    amount?: number;
  };
  pricing?: {
    subtotal: number;
    referralDiscount?: number;
    referralDiscountPercent?: number;
    netAmount?: number;
    vat?: number;
    vatPercent?: number;
    total: number;
  };
  paymentInfo?: {
    iban: string;
    accountHolder: string;
    reference?: string;
  };
}
