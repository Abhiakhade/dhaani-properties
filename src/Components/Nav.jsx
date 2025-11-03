import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUserShield, FaWhatsapp } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const adminRef = useRef(null);
  const mobileRef = useRef(null);

  // ✅ Read token (user only)
  const readAuthFromLocalStorage = () => {
    const tokenKeys = ["token", "authToken", "accessToken", "jwt"];
    const token =
      tokenKeys.map((k) => localStorage.getItem(k)).find(Boolean) || null;
    return { token };
  };

  useEffect(() => {
    const { token } = readAuthFromLocalStorage();
    setIsAuthenticated(!!token);
    setLoginOpen(false);
    setAdminOpen(false);
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        adminRef.current &&
        !adminRef.current.contains(e.target) &&
        mobileRef.current &&
        !mobileRef.current.contains(e.target)
      ) {
        setLoginOpen(false);
        setAdminOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setLoginOpen(false);
        setAdminOpen(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleLogout = () => {
    const keysToRemove = [
      "token",
      "authToken",
      "accessToken",
      "jwt",
      "user",
      "profile",
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    setIsAuthenticated(false);
    navigate("/login");
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
  };

  // ✅ Dynamic WhatsApp message based on page route
  const getWhatsAppMessage = () => {
    if (location.pathname.includes("buy"))
      return "Hi! I'm interested in buying a property.";
    if (location.pathname.includes("sell"))
      return "Hello! I want to sell my property.";
    if (location.pathname.includes("contact"))
      return "Hi! I’d like to get in touch with Dhaani Properties.";
    if (location.pathname.includes("services"))
      return "Hello! I want to know more about your services.";
    return "Hi! I'm interested in Dhaani Properties.";
  };

  // ✅ WhatsApp URL
  const whatsappNumber = "917037989896"; // change this to your number
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    getWhatsAppMessage()
  )}`;

  return (
    <>
      <nav className="bg-blue-50 shadow-md sticky w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-gray-800 tracking-wide uppercase">
              Dhaani <span className="text-indigo-600 ml-1">Properties</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Home
            </Link>
            <Link
              to="/all-properties"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              All
            </Link>
            <Link
              to="/properties/buy"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Buy
            </Link>
            <Link
              to="/sell-property"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Sell
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Contact
            </Link>

            {/* --- User Account --- */}
            <div className="relative" ref={dropdownRef}>
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setLoginOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md"
                >
                  <FaUserShield className="w-5 h-5" />
                  User
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      loginOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md"
                >
                  <FaUserCircle className="w-5 h-5" />
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      loginOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              )}

              <AnimatePresence>
                {loginOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {!isAuthenticated ? (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setLoginOpen(false)}
                          className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Login
                        </Link>
                        <Link
                          to="/login?isLogin=false"
                          onClick={() => setLoginOpen(false)}
                          className="block px-4 py-3 text-green-600 hover:bg-green-50 border-t"
                        >
                          Register
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setLoginOpen(false)}
                          className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- Admin Account (hidden if user logged in) --- */}
            {!isAuthenticated && (
              <div className="relative" ref={adminRef}>
                <button
                  type="button"
                  onClick={() => setAdminOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md"
                >
                  <FaUserShield className="w-5 h-5" />
                  Admin
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      adminOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {adminOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <Link
                        to="/admin-login"
                        onClick={() => setAdminOpen(false)}
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Login
                      </Link>
                      <Link
                        to="/admin-register"
                        onClick={() => setAdminOpen(false)}
                        className="block px-4 py-3 text-green-600 hover:bg-green-50 border-t"
                      >
                        Admin Register
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* --- Mobile Menu Toggle --- */}
          <div className="md:hidden" ref={mobileRef}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md border-t">
            <div className="flex flex-col items-center py-3 space-y-3">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Home
              </Link>
              <Link
                to="/all-properties"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                All
              </Link>
              <Link
                to="/properties/buy"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Buy
              </Link>
              <Link
                to="/properties/sell"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Sell
              </Link>
              <Link
                to="/services"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Services
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ✅ Floating WhatsApp Button */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-50 bg-green-500 text-white rounded-full p-2 shadow-2xl hover:scale-110 hover:bg-green-600 transition-all duration-300 group"
      >
        <FaWhatsapp className="w-7 h-7 animate-pulse" />
        <span className="absolute right-15 bottom-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 bg-green-600 text-white text-sm font-semibold px-2 py-1 rounded-lg shadow-md transition-all duration-300">
          Chat on WhatsApp
        </span>
      </a>
    </>
  );
};

export default Nav;
