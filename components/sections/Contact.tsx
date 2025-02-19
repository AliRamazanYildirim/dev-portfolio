"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import NoiseBackground from "../NoiseBackground";
import SplitText from "@/TextAnimations/SplitText";

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
    <SplitText text="Great things can happen" />
    <SplitText text={' with a simple "Hello!"'} />
  </div>
);
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Sending email with:", {
        from_name: formData.name,
        from_email: formData.email,
        to_name: "Ali",
        message: formData.message,
      });

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          to_name: "Ali",
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log("Email sent successfully:", result);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to send email:", err);
      setError("Something went wrong. Please try again later.");
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
            Your message has been sent. Thank you!
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
                className="content w-full bg-transparent border-none text-lg placeholder-gray focus:outline-none focus:ring-0 md:text-lgContent"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative border-b border-gray md:col-span-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="content w-full bg-transparent border-none text-lg placeholder-gray focus:outline-none focus:ring-0 md:text-lgContent"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative border-b border-gray md:col-span-6">
              <textarea
                name="message"
                placeholder="Message"
                className="content w-full bg-transparent border-none text-lg placeholder-gray focus:outline-none focus:ring-0 md:text-lgContent"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="col-span-3 mt-6 py-3 px-6 bg-black text-white rounded-md hover:bg-gray"
            >
              Send Message
            </button>
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
