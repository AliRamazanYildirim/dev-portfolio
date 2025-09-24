import toast from "react-hot-toast";

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  companyname: string;
  email: string;
  phone: string;
  address: string;
  projectStatus?: 'gestart' | 'in-vorbereitung' | 'abgeschlossen';
  city?: string;
  postcode?: string;
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
  ): Promise<Customer | null> {
    const url =
      editingCustomer && (editingCustomer as any).id
        ? `/api/admin/customers/${(editingCustomer as any).id}`
        : "/api/admin/customers";
    const method = editingCustomer ? "PUT" : "POST";

    let savedCustomer: Customer | null = null;

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

      // If server returned the created/updated customer, normalize it
      // server may return `_id` so map to `id` if necessary
      const data = json.data || null;
      if (data) {
        savedCustomer = data._id ? { ...data, id: data._id } : data;
      } else if (editingCustomer) {
        // Server didn't return the saved data on update — create a best-effort
        // returned object by merging the existing editingCustomer and the
        // provided customerData (this ensures callers can use an id/email)
        savedCustomer = {
          ...(editingCustomer as any),
          ...customerData,
          id: (editingCustomer as any).id,
        } as Customer;
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
      error: (e) => {
        const msg = e instanceof Error ? e.message : "The process has failed.";
        const lower = String(msg).toLowerCase();
        if (
          lower.includes("duplicate") ||
          lower.includes("e11000") ||
          lower.includes("duplicate key") ||
          lower.includes("email_1")
        ) {
          return "A customer with this email already exists.";
        }
        return msg;
      },
    });

    return savedCustomer;
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
