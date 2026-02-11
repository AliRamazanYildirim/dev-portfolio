"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoiseBackground from "../NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";
import toast from "react-hot-toast";
import ContactInfo from "./ContactInfo";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationDictionary } from "@/constants/translations";

const Contact = () => {
  const { dictionary } = useTranslation();
  const contactDictionary = dictionary.contact;
  const contactInfoDictionary = dictionary.contactInfo;

  return (
    <NoiseBackground mode="light" intensity={0.1}>
      <section id="contact" className="px-7 py-10 md:py-5">
        <div className="container mx-auto">
          <Header
            lineOne={contactDictionary.headingLineOne}
            lineTwo={contactDictionary.headingLineTwo}
          />
          <ContactForm
            contactDictionary={contactDictionary}
            contactInfoDictionary={contactInfoDictionary}
          />
        </div>
      </section>
    </NoiseBackground>
  );
};

const Header = ({ lineOne, lineTwo }: { lineOne: string; lineTwo: string }) => (
  <h2 className="heading sm:text-4xl lg:text-lgHeading mb-10 md:mb-20">
    <SplitText text={lineOne} />
    <SplitText text={lineTwo} />
  </h2>
);
const ContactForm = ({
  contactDictionary,
  contactInfoDictionary,
}: {
  contactDictionary: TranslationDictionary["contact"];
  contactInfoDictionary: TranslationDictionary["contactInfo"];
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const tId = toast.loading(contactDictionary.toastSending);
      // Zuerst Nachricht in Database speichern
      const dbResponse = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const dbResult = await dbResponse.json();

      if (!dbResult.success) {
        throw new Error(dbResult.error || contactDictionary.toastErrorFallback);
      }

      // Nachricht gespeichert, kein Logging

      // Server-side e-posta gönderimi (API) — EmailJS client-side kullanımdan vazgeçildi
      const emailResp = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const emailResult = await emailResp
        .json()
        .catch(() => ({ success: false }));
      if (!emailResult.success) {
        // E-posta başarısız olduysa kullanıcıya uyar
        console.warn("Email sending failed", emailResult);
        toast.error(contactDictionary.toastEmailError);
      }

      // Erfolg anzeigen
      setSubmitted(true);
      toast.success(contactDictionary.toastSuccess, { id: tId });

      // Form nach 5 Sekunden zurücksetzen
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 5000);
    } catch (err) {
      const fallback = contactDictionary.toastErrorFallback;
      const message =
        err instanceof Error && err.message ? err.message : fallback;
      setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-green-600 text-center text-xl"
          >
            {contactDictionary.success}
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:grid md:grid-cols-12 gap-6 mx-auto"
          >
            <div className="relative border-b border-gray md:col-span-3">
              <input
                type="text"
                name="name"
                placeholder={contactDictionary.placeholders.name}
                className="content w-full bg-transparent border-none text-lg placeholder-[#260a03] focus:outline-none focus:ring-0 sm:text-xl lg:text-lgContent"
                value={formData.name ?? ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative border-b border-gray md:col-span-3">
              <input
                type="email"
                name="email"
                placeholder={contactDictionary.placeholders.email}
                className="content w-full bg-transparent border-none text-lg placeholder-[#260a03] focus:outline-none focus:ring-0 sm:text-xl lg:text-lgContent"
                value={formData.email ?? ""}
                onChange={handleChange}
                required
                suppressHydrationWarning={true}
              />
            </div>

            <div className="relative border-b border-gray md:col-span-6">
              <textarea
                name="message"
                placeholder={contactDictionary.placeholders.message}
                className="content w-full bg-transparent border-none text-lg placeholder-[#260a03] focus:outline-none focus:ring-0 sm:text-xl lg:text-lgContent"
                value={formData.message ?? ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-12 flex justify-end mt-6">
              <button
                type="submit"
                className="py-3 px-6 bg-black text-white rounded-md hover:bg-[#260a03] transition-colors duration-200"
              >
                {contactDictionary.submit}
              </button>
            </div>
            {/* Phone contact rendered under the submit button */}
            <div className="col-span-12 flex justify-center mt-6">
              <ContactInfo
                availabilityLabel={contactInfoDictionary.availability}
                badgeLabel={contactInfoDictionary.badge}
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="text-red-600 mt-4 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
};

export default Contact;
