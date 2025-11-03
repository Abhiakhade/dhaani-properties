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
} from "lucide-react";

// --- Reusable Copy Button Component ---
const CopyButton = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const tempInput = document.createElement("textarea");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={`Click to copy ${label}`}
      className={`w-5.5 h-5.5 ml-3 rounded-full text-white transition-colors duration-200 
                  ${copied ? "bg-black" : "bg-gray-700 hover:bg-black"}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

const Contact = () => {
  // 🔹 Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // 🔹 Handle Input Changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Handle Form Submit (EmailJS integration)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace these with your EmailJS credentials
    const SERVICE_ID = "YOUR_SERVICE_ID";
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY).then(
      () => {
        toast.success("Message sent successfully! ✅");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      },
      (error) => {
        console.error("EmailJS Error:", error);
        toast.error("Failed to send message. Please try again!");
      }
    );
  };

  // 🔹 Contact Info Data
  const contactData = [
    { icon: MapPin, label: "Address", value: "Vrindavan, Uttar Pradesh" },
    { icon: Phone, label: "Phone", value: "+91 7037989896", copyable: true },
    { icon: Mail, label: "Email", value: "info@dhaaniproperties.com", copyable: true },
    { icon: Clock, label: "Hours", value: "Mon - Sat: 9:00 AM - 7:00 PM" },
  ];

  // 🔹 Social Data
  const socialData = [
    { name: "Facebook", icon: Facebook, url: "www.facebook.com" },
    { name: "Twitter", icon: Twitter, url: "www.x.com" },
    { name: "Instagram", icon: Instagram, url: "add insta" },
    { name: "LinkedIn", icon: Linkedin, url: "add linkdin" },
  ];

  // 🔹 Contact Info Item Component
  const ContactItem = ({ icon: Icon, label, value, copyable = false }) => (
    <div className="flex items-start space-x-3">
      <Icon className="text-xl text-black flex-shrink-0 mt-0.5" />
      <div className="flex items-center">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-gray-700">{label}</p>
          <p className="text-sm font-medium text-black">{value}</p>
        </div>
        {copyable && <CopyButton value={value} label={label} />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-8 pb-12 font-sans">
      <ToastContainer position="top-center" />
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden border border-black mx-4">
        {/* Header */}
        <div className="text-center py-8 border-b border-black">
          <h2 className="text-4xl font-extrabold tracking-tight text-black">
            CONNECT WITH US
          </h2>
          <p className="text-base text-gray-700 mt-2">
            We're ready to assist you. Fill out the form or reach out directly.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-black">
          {/* Contact Form */}
          <div className="lg:col-span-2 p-6 md:p-10">
            <h3 className="text-2xl font-bold mb-6 text-black">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 text-sm bg-white border border-black rounded-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 text-sm bg-white border border-black rounded-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 text-sm bg-white border border-black rounded-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 text-sm bg-white border border-black rounded-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select Subject</option>
                <option>General Inquiry</option>
                <option>Support Request</option>
                <option>Feedback</option>
              </select>

              <textarea
                name="message"
                placeholder="Your Message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 text-sm bg-white border border-black rounded-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
              ></textarea>

              <button
                type="submit"
                className="w-full py-2 bg-black text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition border border-black"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Socials */}
          <div className="lg:col-span-1 p-6 md:p-10 bg-gray-50 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-300 pb-2">
                Contact Details
              </h3>
              <div className="space-y-5">
                {contactData.map((item, index) => (
                  <ContactItem key={index} {...item} />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black">
              <h3 className="text-xl font-bold text-black mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                {socialData.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    aria-label={`Follow us on ${item.name}`}
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full text-md hover:bg-gray-700 transition"
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
