"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginService } from "../services/adminAuthService";

interface LoginTexts {
  errorAllFields: string;
  errorLoginFailed: string;
  errorConnection: string;
  signingIn: string;
}

export function useAdminLoginForm(loginTexts: LoginTexts) {
  const router = useRouter();
  const turnstileEnabled = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "true";
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileRefreshKey, setTurnstileRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const turnstileRequiredMessage = "Please complete the security verification.";

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

      if (turnstileEnabled && !turnstileToken) {
        setError(turnstileRequiredMessage);
        return;
      }

      const result = await loginService({
        ...formData,
        turnstileToken,
      });

      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || loginTexts.errorLoginFailed);
      }
    } catch (err) {
      setError(loginTexts.errorConnection);
    } finally {
      if (turnstileEnabled) {
        setTurnstileToken("");
        setTurnstileRefreshKey((prev) => prev + 1);
      }
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
    turnstileEnabled,
    turnstileSiteKey,
    turnstileToken,
    setTurnstileToken,
    turnstileRefreshKey,
  };
}
