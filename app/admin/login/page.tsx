"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NoiseBackground from "@/components/NoiseBackground";

// Interface für Login-Form-Daten - Interface for login form data
interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Eingabe-Handler - Input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Fehler zurücksetzen bei neuer Eingabe - Reset error on new input
    if (error) setError("");
  };

  // Login-Handler - Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Einfache Client-Side-Validierung - Simple client-side validation
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Alle Felder sind erforderlich - All fields are required");
        return;
      }

      // Login-API aufrufen - Call login API
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Erfolgreiche Anmeldung - Successful login
        router.push("/admin");
        router.refresh(); // Seite aktualisieren für Session - Refresh page for session
      } else {
        // Fehler anzeigen - Show error
        setError(result.error || "Anmeldung fehlgeschlagen - Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Verbindungsfehler - Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Login Card - Admin panelindeki tasarımla uyumlu */}
            <div className="bg-[#eeede9] rounded-2xl shadow-lg border border-white/20 overflow-hidden p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h1 className="title text-4xl text-[#131313] mb-2">
                    Admin Login
                  </h1>
                  <p className="content text-[#131313]/70">
                    Melden Sie sich an, um das Admin-Panel zu verwalten
                  </p>
                </motion.div>
              </div>

              {/* Login Form */}
              <motion.form
                onSubmit={handleLogin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-200 rounded-xl p-4"
                    >
                      <p className="text-red-700 text-sm font-medium">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#131313]"
                  >
                    E-Mail Adresse
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#131313]"
                  >
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full px-6 py-4 pr-12 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#131313]/50 hover:text-[#131313] transition-colors disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full px-8 py-4 bg-[#131313] hover:bg-[#131313]/90 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Anmelden...
                    </div>
                  ) : (
                    "Anmelden"
                  )}
                </motion.button>
              </motion.form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-[#131313]/50">
                  Nur für autorisierte Administratoren
                </p>
              </motion.div>
            </div>

            {/* Zurück zur Startseite - Back to home */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center mt-8"
            >
              <button
                onClick={() => router.push("/")}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                ← Zurück zur Startseite - Back to home
              </button>
            </motion.div>
          </motion.div>
        </div>
      </NoiseBackground>
    </div>
  );
}
