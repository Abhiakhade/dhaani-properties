import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../config";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const registerQuery = query.get("isLogin");
  const initialIsLogin = registerQuery === "false" ? false : true;

  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
  });

  useEffect(() => {
    const newRegisterQuery = new URLSearchParams(location.search).get("isLogin");
    setIsLogin(newRegisterQuery === "false" ? false : true);
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin
        ? `${BASE_URL}/api/admin/login`
        : `${BASE_URL}/api/admin/register`;

      if (!isLogin && formData.password !== formData.confirmPassword) {
        alert("⚠️ Passwords do not match!");
        setLoading(false);
        return;
      }

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            secretKey: formData.secretKey,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "❌ Something went wrong!");
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("role", "admin");
        alert("✅ Admin login successful!");
        navigate("/admin-dashboard", { replace: true });
      } else {
        alert("🎉 Admin registered successfully! You can now login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Server error! Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-black via-gray-800 to-gray-900 text-white relative"
      >
        <h1 className="text-4xl font-bold text-center leading-snug z-10">
          Admin <span className="text-yellow-400">Control Panel</span>
        </h1>
        <p className="text-gray-300 mt-4 text-center px-8 z-10">
          Manage users, properties, and system configurations securely.
        </p>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-50 p-8"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isLogin ? "Admin Login" : "Register New Admin"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <input
                    id="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <input
                    id="secretKey"
                    placeholder="Admin Secret Key"
                    value={formData.secretKey}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              id="email"
              type="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
              required
            />

            <div className="relative">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                required
              />
              <div
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-yellow-500"
              >
                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
            </div>

            {!isLogin && (
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={confirmVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <div
                  onClick={() => setConfirmVisible(!confirmVisible)}
                  className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-yellow-500"
                >
                  {confirmVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg text-white transition-all ${
                isLogin
                  ? "bg-black hover:bg-gray-800"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              type="submit"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </motion.button>

            <p
              onClick={() => setIsLogin(!isLogin)}
              className="text-center text-black hover:text-yellow-500 hover:underline cursor-pointer mt-2"
            >
              {isLogin ? "New Admin? Register here" : "Already have an account? Login"}
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
