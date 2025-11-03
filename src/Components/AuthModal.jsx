import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { BASE_URL } from "../config"; // ✅ Import dynamic backend URL

// ✅ Toast Notification Component
const Toast = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    transition={{ duration: 0.3 }}
    className="fixed bottom-6 right-6 bg-white text-black border border-gray-300 rounded-lg shadow-xl px-6 py-3 font-medium flex items-center gap-3 z-[9999]"
  >
    <span>✅</span> {message}
    <button
      onClick={onClose}
      className="ml-3 text-gray-500 hover:text-black text-lg"
    >
      ✕
    </button>
  </motion.div>
);

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState(null);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? `${BASE_URL}/api/auth/login`
        : `${BASE_URL}/api/auth/signup`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            city: formData.city,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setFormData({
          name: "",
          phone: "",
          city: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsLogin(true);
        setToast(isLogin ? "Login Successful 🎉" : "Signup Successful 🚀");

        // ✅ Wait 1.5s → close modal and redirect
        setTimeout(() => {
          setToast(null);
          onClose();
          navigate("/");
        }, 1500);
      } else {
        setToast(data.message || "Something went wrong ❌");
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setToast("Server error ❌");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="relative w-[100%] max-w-md bg-white text-black rounded-3xl shadow-2xl p-9 sm:p-8 border border-gray-200 overflow-hidden"
            style={{ height: "95vh" }}
          >
            {/* Floating Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-[10%] translate-x-1/2 bg-black text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition"
            >
              ✕
            </button>

            {/* Tabs */}
            <div className="flex justify-center mb-4 mt-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-2 font-semibold border-b-2 transition-all ${
                  isLogin
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-2 font-semibold border-b-2 transition-all ${
                  !isLogin
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-6">
              {isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}
            </h2>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3 overflow-y-auto h-[60vh] pr-6"
            >
              {!isLogin && (
                <>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                  />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                  />
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                  />
                </>
              )}

              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
              />
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
              />
              {!isLogin && (
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                />
              )}

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-900 transition"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-5">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-xs text-gray-500">Or continue with</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Social Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">
                <FcGoogle className="text-xl" /> Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">
                <FaFacebookF className="text-blue-600 text-lg" /> Facebook
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
};

export default AuthModal;
