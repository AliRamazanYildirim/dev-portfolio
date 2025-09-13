import toast from "react-hot-toast";

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  companyname: string;
  email: string;
  phone: string;
  address: string;
  reference: string;
  price?: number | null;
  finalPrice?: number | null;
  discountRate?: number | null;
  myReferralCode?: string;
  referralCount?: number;
  created_at?: string | null;
}

export interface FetchCustomersOptions {
  sort?: string;
  from?: string;
  to?: string;
  q?: string;
}

export const customerService = {
  async fetchCustomers(opts?: FetchCustomersOptions): Promise<Customer[]> {
    try {
      let url = "/api/admin/customers";
      const params = new URLSearchParams();
      if (opts?.sort) params.set("sort", opts.sort);
      if (opts?.from) params.set("from", opts.from);
      if (opts?.to) params.set("to", opts.to);
      if (opts?.q) params.set("q", opts.q);
      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const res = await fetch(url);
      const result = await res.json();
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  },

  async saveCustomer(
    customerData: Partial<Customer>,
    editingCustomer?: Customer | null
  ): Promise<void> {
    const url = editingCustomer
      ? `/api/admin/customers/${editingCustomer.id}`
      : "/api/admin/customers";
    const method = editingCustomer ? "PUT" : "POST";

    const promise = (async () => {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      // Server versendet Referrer-Mail jetzt direkt via Nodemailer.
      if (!editingCustomer && json.referrerEmail) {
        toast.success("Referrer wurde per E-Mail benachrichtigt.");
      }

      return editingCustomer
        ? "The customer has been updated!"
        : "The customer has been saved!";
    })();

    await toast.promise(promise, {
      loading: editingCustomer ? "Updating..." : "Saving...",
      success: (msg) => (typeof msg === "string" ? msg : "Successful"),
      error: (e) =>
        e instanceof Error ? e.message : "The process has failed.",
    });
  },

  async deleteCustomer(id: string): Promise<void> {
    const promise = (async () => {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      return "Customer has been deleted!";
    })();

    await toast.promise(promise, {
      loading: "Will be deleted...",
      success: (msg) => (typeof msg === "string" ? msg : "Deleted"),
      error: (e) => (e instanceof Error ? e.message : "Deletion failed"),
    });
  },

  async validateReferralCode(code: string, basePrice: string) {
    if (!code.trim() || !basePrice.trim()) return null;

    try {
      const response = await fetch("/api/referral/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: code.trim(),
          basePrice: Number(basePrice),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Valid reference code! ${result.data.discount.rate}% discount will be applied`
        );
        return {
          isValid: true,
          referrerName: result.data.referrer.name,
          discount: result.data.discount,
        };
      } else {
        toast.error("Invalid reference code");
        return { isValid: false, error: result.error };
      }
    } catch (error) {
      toast.error("Reference code could not be verified");
      return {
        isValid: false,
        error: "An error occurred while checking the reference code.",
      };
    }
  },

  async sendReferralEmail(
    customerId: string,
    customerEmail: string
  ): Promise<void> {
    const response = await fetch("/api/referral/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, customerEmail }),
    });

    const result = await response.json();
    if (result.success && result.data) {
      toast.success(`Referral code sent! Code: ${result.data.referralCode}`);
      return;
    }
    toast.error(
      "Email could not be sent: " + (result.error || "Unknown error")
    );
  },
};
