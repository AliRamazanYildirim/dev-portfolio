import { useState } from "react";
import type { Customer } from "@/types/customer";
import { InvoiceService } from "@/services/invoiceService";
import toast from "react-hot-toast";

interface UseInvoiceGeneratorReturn {
  isGenerating: boolean;
  generateInvoice: (customer: Customer) => Promise<void>;
}

export const useInvoiceGenerator = (): UseInvoiceGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoice = async (customer: Customer): Promise<void> => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      await InvoiceService.generateInvoice(customer);
      toast.success("Invoice PDF generated successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateInvoice,
  };
};
