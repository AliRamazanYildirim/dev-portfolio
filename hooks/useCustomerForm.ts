import { useState } from "react";
import { customerService, Customer } from "@/services/customerService";
import toast from "react-hot-toast";

export const useCustomerForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    companyname: "",
    email: "",
    phone: "",
    address: "",
    reference: "",
    price: "",
  });

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [referralValidation, setReferralValidation] = useState<any>(null);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "reference" || field === "price") {
      const newReference = field === "reference" ? value : formData.reference;
      const newPrice = field === "price" ? value : formData.price;

      if (newReference.trim() && newPrice.trim()) {
        validateReferralCode(newReference, newPrice);
      } else {
        setReferralValidation(null);
      }
    }
  };

  const validateReferralCode = async (code: string, price: string) => {
    const result = await customerService.validateReferralCode(code, price);
    setReferralValidation(result);
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

    if (!editingCustomer) {
      const existingCustomer = customers.find(
        (c) => c.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (existingCustomer) {
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
      reference: customer.reference,
      price: customer.price != null ? String(customer.price) : "",
    });
    setEditingCustomer(customer);
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
