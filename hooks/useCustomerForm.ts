import { useState } from "react";
import { customerService } from "@/services/customerService";
import type { Customer } from "@/types/customer";
import toast from "react-hot-toast";

export const useCustomerForm = (onFieldChange?: (field: string, value: string) => void) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    companyname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    reference: "",
    price: "",
  });

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [referralValidation, setReferralValidation] = useState<any>(null);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (onFieldChange) {
      try {
        onFieldChange(field, value);
      } catch (e) {
        // noop - parent may not care
      }
    }

    if (field === "reference" || field === "price") {
      const newReference = String(field === "reference" ? value : formData.reference || "");
      const newPrice = String(field === "price" ? value : formData.price || "");

      if (newReference.trim() !== "" && newPrice.trim() !== "") {
        validateReferralCode(newReference.trim(), newPrice.trim());
      } else {
        setReferralValidation(null);
      }
    }
  };

  const validateReferralCode = async (code: string, price: string) => {
    try {
      const result = await customerService.validateReferralCode(code, price);
      setReferralValidation(result);
      if (result?.isValid) {
        toast.success(`Referral code applied! ${result.discount ?? 0}% discount`);
      }
    } catch {
      toast.error("Error validating referral code");
      setReferralValidation(null);
    }
  };

  const validateForm = (customers: Customer[]) => {
    if (
      !formData.firstname.trim() ||
      !formData.lastname.trim() ||
      !formData.email.trim()
    ) {
      toast.error("First name, last name, and email are required!");
      return false;
    }

    // Check duplicates both in create and edit modes.
    const existingCustomer = customers.find(
      (c) => c.email.toLowerCase() === formData.email.toLowerCase()
    );
    if (existingCustomer) {
      // If creating a new customer, any existing match is a conflict.
      if (!editingCustomer) {
        toast.error(
          `This email address is already registered to: ${existingCustomer.firstname} ${existingCustomer.lastname}`
        );
        return false;
      }

      // If editing, only conflict when the found customer is a different record.
      const normalizedExistingId = (existingCustomer as any).id || (existingCustomer as any)._id;
      const editingId = (editingCustomer as any).id || (editingCustomer as any)._id;
      if (String(normalizedExistingId) !== String(editingId)) {
        toast.error(
          `This email address is already registered to: ${existingCustomer.firstname} ${existingCustomer.lastname}`
        );
        return false;
      }
    }

    return true;
  };

  const getCustomerData = () => ({
    ...formData,
    price: formData.price !== "" ? Number(formData.price) : null,
  });

  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      companyname: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postcode: "",
      reference: "",
      price: "",
    });
    setEditingCustomer(null);
    setReferralValidation(null);
  };

  const setEditForm = (customer: Customer) => {
    setFormData({
      firstname: customer.firstname,
      lastname: customer.lastname,
      companyname: customer.companyname,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: (customer as any).city || "",
      postcode: (customer as any).postcode || "",
      reference: customer.reference,
      price: customer.price != null ? String(customer.price) : "",
    });
    // Normalize Mongo returned documents which may have `_id` instead of `id`.
    const normalized = (customer as any)._id ? { ...customer, id: (customer as any)._id } : customer;
    setEditingCustomer(normalized as Customer);
    setReferralValidation(null);
  };

  return {
    formData,
    updateField,
    editingCustomer,
    referralValidation,
    validateForm,
    getCustomerData,
    resetForm,
    setEditForm,
  };
};
