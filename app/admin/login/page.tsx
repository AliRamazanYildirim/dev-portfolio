"use client";

import { motion } from "framer-motion";
import NoiseBackground from "@/components/ui/NoiseBackground";
import { useTranslation } from "@/hooks/useTranslation";
import { useAdminSessionRedirect } from "./hooks/useAdminSessionRedirect";
import { useAdminLoginForm } from "./hooks/useAdminLoginForm";
import LoginForm from "./components/LoginForm";
import CheckingSessionScreen from "./components/CheckingSessionScreen";
import BackToHomeButton from "./components/BackToHomeButton";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const { dictionary } = useTranslation();
  const loginTexts = dictionary.admin.login;

  const { checkingSession } = useAdminSessionRedirect();

  const {
    formData,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleLogin,
  } = useAdminLoginForm(loginTexts);

  if (checkingSession)
    return <CheckingSessionScreen message={loginTexts.checkingSession} />;

  return (
    <div className="min-h-screen w-full">
      <NoiseBackground mode="dark" intensity={0.1}>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="bg-[#eeede9] rounded-2xl shadow-lg border border-white/20 overflow-hidden p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h1 className="title text-4xl text-[#131313] mb-2">
                    {loginTexts.title}
                  </h1>
                  <p className="content text-[#131313]/70">
                    {loginTexts.subtitle}
                  </p>
                </motion.div>
              </div>

              <LoginForm
                formData={formData}
                isLoading={isLoading}
                error={error}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleInputChange={handleInputChange}
                handleLogin={handleLogin}
                loginTexts={loginTexts}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-[#131313]/50">
                  {loginTexts.footerNote}
                </p>
              </motion.div>
            </div>

            <BackToHomeButton>
                <span className="inline-flex items-center font-bold">
                <ArrowLeft className="mr-1 h-4 w-4 font-bold" />{loginTexts.backToHome}
                </span>
            </BackToHomeButton>
          </motion.div>
        </div>
      </NoiseBackground>
    </div>
  );
}
