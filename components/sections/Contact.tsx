"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoiseBackground from "../NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";
import toast from "react-hot-toast";

const Contact = () => {
  return (
    <NoiseBackground mode="light" intensity={0.1}>
      <section id="contact" className="px-7 py-10 md:py-20">
        <div className="container mx-auto">
          <Header />
          <ContactForm />
        </div>
      </section>
    </NoiseBackground>
  );
};

const Header = () => (
  <div className="heading md:text-lgHeading mb-10 md:mb-20">
    <SplitText text="Tell us your idea; " />
    <SplitText text={"we’ll build the wow."} />
  </div>
);
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const tId = toast.loading("Message is being sent...");
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
        throw new Error(
          dbResult.error || "Fehler beim Speichern der Nachricht"
        );
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
        toast.error(
          "Failed to send notification email, but message was saved."
        );
      }

      // Erfolg anzeigen
      setSubmitted(true);
      toast.success("Message sent successfully.", { id: tId });

      // Form nach 5 Sekunden zurücksetzen
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 5000);
    } catch (err) {
      // Fehler beim Senden der Nachricht, kein Logging
      setError(
        err instanceof Error
          ? err.message
          : "An error has occurred. Please try again later."
      );
      toast.error(
        err instanceof Error
          ? err.message
          : "An error has occurred. Please try again later."
      );
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
            Your message has been sent successfully. Thank you!
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
                placeholder="Name"
                className="content w-full bg-transparent border-none text-lg placeholder-[#260a03] focus:outline-none focus:ring-0 md:text-lgContent"
                value={formData.name ?? ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative border-b border-gray md:col-span-3">
              <input
                type="email"
                name="email"
                placeholder="E-Mail"
                className="content w-full bg-transparent border-none text-lg placeholder-[#260a03] focus:outline-none focus:ring-0 md:text-lgContent"
                value={formData.email ?? ""}
                onChange={handleChange}
                required
                suppressHydrationWarning={true}
              />
            </div>

            <div className="relative border-b border-gray md:col-span-6">
              <textarea
                name="message"
                placeholder="Message"
                className="content w-full bg-transparent border-none text-lg placeholder-[#260a03] focus:outline-none focus:ring-0 md:text-lgContent"
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
                Send message
              </button>
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
