"use client";

import { AnimatePresence, motion } from "framer-motion";
import ErrorAlert from "./ErrorAlert";

interface Props {
  formData: { email: string; password: string };
  isLoading: boolean;
  error: string;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  loginTexts: any;
}

export default function LoginForm({
  formData,
  isLoading,
  error,
  showPassword,
  setShowPassword,
  handleInputChange,
  handleLogin,
  loginTexts,
}: Props) {
  return (
    <motion.form
      onSubmit={handleLogin}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ErrorAlert>{error}</ErrorAlert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-[#131313]"
        >
          {loginTexts.emailLabel}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={loginTexts.emailPlaceholder}
          disabled={isLoading}
          className="w-full px-6 py-4 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-[#131313]"
        >
          {loginTexts.passwordLabel}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={loginTexts.passwordPlaceholder}
            disabled={isLoading}
            className="w-full px-6 py-4 pr-12 bg-white/80 border border-[#131313]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#131313]/50 hover:text-[#131313] transition-colors disabled:cursor-not-allowed"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-12.542 0C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full px-8 py-4 bg-[#131313] hover:bg-[#131313]/90 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
            {loginTexts.signingIn}
          </div>
        ) : (
          loginTexts.signIn
        )}
      </motion.button>
    </motion.form>
  );
}
