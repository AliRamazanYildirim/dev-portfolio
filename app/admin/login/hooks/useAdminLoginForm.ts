"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginService } from "../services/adminAuth.service";

interface LoginTexts {
  errorAllFields: string;
  errorLoginFailed: string;
  errorConnection: string;
  signingIn: string;
}

export function useAdminLoginForm(loginTexts: LoginTexts) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError(loginTexts.errorAllFields);
        return;
      }

      const result = await loginService(formData);

      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || loginTexts.errorLoginFailed);
      }
    } catch (err) {
      setError(loginTexts.errorConnection);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleLogin,
    setError,
  };
}
