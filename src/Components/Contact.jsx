import React, { useState } from "react";
import emailjs from "emailjs-com";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Clock,
  Copy,
  Check,
  ArrowUpRight,
  Send,
  Sparkles,
} from "lucide-react";

// ======================================================
// COPY BUTTON
// ======================================================

const CopyButton = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      toast.success(`${label} copied!`, {
        position: "bottom-right",
        autoClose: 1800,
        hideProgressBar: true,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Unable to copy.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      className="group ml-2 flex h-8 w-8 items-center justify-center
                 rounded-full border border-white/10 bg-white/5
                 text-gray-400 transition-all duration-300
                 hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
      )}
    </button>
  );
};

// ======================================================
// CONTACT ITEM
// ======================================================

const ContactItem = ({ icon: Icon, label, value, copyable = false }) => {
  return (
    <div className="group flex items-start gap-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center
                   rounded-xl border border-white/10 bg-white/5
                   text-gray-300 transition-all duration-300
                   group-hover:border-white/20 group-hover:bg-white/10
                   group-hover:text-white"
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          {label}
        </p>

        <div className="flex items-center">
          <p className="break-words text-sm font-medium leading-6 text-gray-200">
            {value}
          </p>

          {copyable && <CopyButton value={value} label={label} />}
        </div>
      </div>
    </div>
  );
};

// ======================================================
// CONTACT PAGE
// ======================================================

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  // ====================================================
  // CONTACT DATA
  // ====================================================

  const contactData = [
    {
      icon: MapPin,
      label: "Visit Us",
      value: "Vrindavan, Uttar Pradesh",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+91 7037989896",
      copyable: true,
    },
    {
      icon: Mail,
      label: "Email Us",
      value: "info@dhaaniproperties.com",
      copyable: true,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Sat · 9:00 AM - 7:00 PM",
    },
  ];

  // ====================================================
  // SOCIAL DATA
  // ====================================================

  const socialData = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://x.com/",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/",
    },
  ];

  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sending) return;

    const SERVICE_ID = "YOUR_SERVICE_ID";
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    if (
      SERVICE_ID === "YOUR_SERVICE_ID" ||
      TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
      PUBLIC_KEY === "YOUR_PUBLIC_KEY"
    ) {
      toast.error("Please configure your EmailJS credentials.");
      return;
    }

    try {
      setSending(true);

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY);

      toast.success("Message sent successfully. We'll get back to you soon!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);

      toast.error("Unable to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
      {/* ==================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large glow */}
        <div
          className="absolute -left-40 -top-40 h-[500px] w-[500px]
                     rounded-full bg-blue-500/10 blur-[120px]"
        />

        <div
          className="absolute -bottom-40 -right-40 h-[550px] w-[550px]
                     rounded-full bg-purple-500/10 blur-[140px]"
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        {/* ==================================================
            HERO
        ================================================== */}

        <section className="mb-12 max-w-4xl">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full
                       border border-white/10 bg-white/[0.04]
                       px-4 py-2 text-xs font-semibold
                       uppercase tracking-[0.18em] text-gray-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Let's talk real estate
          </div>

          <h1
            className="max-w-4xl text-5xl font-black leading-[0.95]
                       tracking-[-0.04em] text-white
                       sm:text-6xl lg:text-8xl"
          >
            Find your next
            <span className="block bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              perfect space.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Whether you're buying, selling, renting, or simply exploring your
            options, our team is here to help you make the right move.
          </p>
        </section>

        {/* ==================================================
            MAIN CARD
        ================================================== */}

        <section
          className="overflow-hidden rounded-[2rem] border border-white/10
                     bg-white/[0.035] shadow-2xl
                     backdrop-blur-2xl"
        >
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            {/* =================================================
                FORM
            ================================================= */}

            <div className="p-6 sm:p-9 lg:p-12">
              <div className="mb-9">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Get in touch
                </p>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Tell us what you need.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                  Send us a message and our property specialists will get back
                  to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAME + EMAIL */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-semibold
                                 uppercase tracking-wider text-gray-500"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-white/10
                                 bg-white/[0.04] px-4 py-3.5
                                 text-sm text-white outline-none
                                 placeholder:text-gray-600
                                 transition-all duration-300
                                 focus:border-blue-400/50
                                 focus:bg-white/[0.06]
                                 focus:ring-4 focus:ring-blue-500/5"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold
                                 uppercase tracking-wider text-gray-500"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-white/10
                                 bg-white/[0.04] px-4 py-3.5
                                 text-sm text-white outline-none
                                 placeholder:text-gray-600
                                 transition-all duration-300
                                 focus:border-blue-400/50
                                 focus:bg-white/[0.06]
                                 focus:ring-4 focus:ring-blue-500/5"
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-semibold
                               uppercase tracking-wider text-gray-500"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10
                               bg-white/[0.04] px-4 py-3.5
                               text-sm text-white outline-none
                               placeholder:text-gray-600
                               transition-all duration-300
                               focus:border-blue-400/50
                               focus:bg-white/[0.06]
                               focus:ring-4 focus:ring-blue-500/5"
                  />
                </div>

                {/* SUBJECT */}

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-xs font-semibold
                               uppercase tracking-wider text-gray-500"
                  >
                    What can we help with?
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-xl
                               border border-white/10
                               bg-white/[0.04] px-4 py-3.5
                               text-sm text-white outline-none
                               transition-all duration-300
                               focus:border-blue-400/50
                               focus:bg-white/[0.06]
                               focus:ring-4 focus:ring-blue-500/5"
                  >
                    <option value="" className="bg-[#111] text-gray-500">
                      Select an option
                    </option>

                    <option value="Property Inquiry" className="bg-[#111]">
                      Property Inquiry
                    </option>

                    <option value="Buy Property" className="bg-[#111]">
                      Buy a Property
                    </option>

                    <option value="Sell Property" className="bg-[#111]">
                      Sell a Property
                    </option>

                    <option value="Rent Property" className="bg-[#111]">
                      Rent a Property
                    </option>

                    <option value="General Inquiry" className="bg-[#111]">
                      General Inquiry
                    </option>

                    <option value="Feedback" className="bg-[#111]">
                      Feedback
                    </option>
                  </select>
                </div>

                {/* MESSAGE */}

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-semibold
                               uppercase tracking-wider text-gray-500"
                  >
                    Your Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={1000}
                    placeholder="Tell us about the property you're looking for..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full resize-none rounded-xl
                               border border-white/10
                               bg-white/[0.04] px-4 py-3.5
                               text-sm leading-6 text-white outline-none
                               placeholder:text-gray-600
                               transition-all duration-300
                               focus:border-blue-400/50
                               focus:bg-white/[0.06]
                               focus:ring-4 focus:ring-blue-500/5"
                  />

                  <div className="mt-2 text-right text-[10px] text-gray-600">
                    {formData.message.length}/1000
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={sending}
                  className="group relative flex w-full items-center
                             justify-center gap-3 overflow-hidden
                             rounded-xl bg-white px-6 py-4
                             text-sm font-bold text-black
                             transition-all duration-300
                             hover:-translate-y-0.5
                             hover:shadow-[0_15px_40px_rgba(255,255,255,0.12)]
                             disabled:cursor-not-allowed
                             disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {sending ? "Sending message..." : "Send Message"}
                  </span>

                  {!sending && (
                    <ArrowUpRight
                      className="relative z-10 h-4 w-4
                                 transition-transform duration-300
                                 group-hover:translate-x-1
                                 group-hover:-translate-y-1"
                    />
                  )}

                  <div
                    className="absolute inset-0 -translate-x-full
                               bg-gradient-to-r from-transparent
                               via-gray-200/70 to-transparent
                               transition-transform duration-700
                               group-hover:translate-x-full"
                  />
                </button>
              </form>
            </div>

            {/* =================================================
                CONTACT INFO
            ================================================= */}

            <aside
              className="relative overflow-hidden border-t border-white/10
                         bg-black/30 p-6 sm:p-9 lg:border-l lg:border-t-0
                         lg:p-10"
            >
              {/* Decorative glow */}

              <div
                className="pointer-events-none absolute -right-24 -top-24
                           h-72 w-72 rounded-full bg-blue-500/10 blur-[90px]"
              />

              <div
                className="pointer-events-none absolute -bottom-24 -left-24
                           h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]"
              />

              <div className="relative flex h-full flex-col">
                <div>
                  <div
                    className="mb-7 flex h-12 w-12 items-center
                               justify-center rounded-2xl
                               border border-white/10 bg-white/5"
                  >
                    <Send className="h-5 w-5 text-blue-400" />
                  </div>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Contact details
                  </p>

                  <h3 className="text-2xl font-bold leading-tight">
                    Let's start a conversation.
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Have a question about a property? Our team is ready to help
                    you find the right opportunity.
                  </p>
                </div>

                {/* CONTACT ITEMS */}

                <div className="mt-10 space-y-7">
                  {contactData.map((item) => (
                    <ContactItem key={item.label} {...item} />
                  ))}
                </div>

                {/* SOCIAL */}

                <div className="mt-auto pt-12">
                  <div className="mb-5 h-px bg-white/10" />

                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Follow us
                  </p>

                  <div className="flex gap-2">
                    {socialData.map((item) => {
                      const Icon = item.icon;

                      return (
                        <a
                          key={item.name}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow us on ${item.name}`}
                          className="group flex h-10 w-10 items-center
                                     justify-center rounded-xl
                                     border border-white/10
                                     bg-white/[0.04]
                                     text-gray-500
                                     transition-all duration-300
                                     hover:-translate-y-1
                                     hover:border-white/20
                                     hover:bg-white/10
                                     hover:text-white"
                        >
                          <Icon
                            className="h-4 w-4 transition-transform
                                       duration-300 group-hover:scale-110"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ==================================================
            BOTTOM NOTE
        ================================================== */}

        <div
          className="mt-8 flex flex-col items-center justify-between
                        gap-3 text-center text-xs text-gray-600
                        sm:flex-row sm:text-left"
        >
          <p>
            © {new Date().getFullYear()} Dhaani Properties. All rights reserved.
          </p>

          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            We're currently available
          </p>
        </div>
      </div>

      {/* ==================================================
          TOAST
      ================================================== */}

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </main>
  );
};

export default Contact;
