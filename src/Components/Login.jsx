import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "../config";
// import { auth, googleProvider, facebookProvider, signInWithPopup } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
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
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const newRegisterQuery = new URLSearchParams(location.search).get("isLogin");
    setIsLogin(newRegisterQuery === "false" ? false : true);
  }, [location.search]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin
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

      if (!isLogin && formData.password !== formData.confirmPassword) {
        alert("⚠️ Passwords do not match!");
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "❌ Something went wrong!");
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "user");
        alert(`✅ Login successful!`);
        navigate("/dashboard", { replace: true });
      } else {
        alert("🎉 Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Login/Register error:", error);
      alert("⚠️ Server error! Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("role", "user");
      alert(`✅ Welcome ${user.displayName || "User"}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      alert("⚠️ Google login failed.");
    }
  };

  // ✅ Facebook Sign-in
  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("role", "user");
      alert(`✅ Welcome ${user.displayName || "User"}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Facebook Sign-in Error:", error);
      alert("⚠️ Facebook login failed.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-black via-gray-800 to-gray-900 text-white relative"
      >
        <h1 className="text-4xl font-bold text-center leading-snug z-10">
          User <span className="text-yellow-400">Login Panel</span>
        </h1>
        <p className="text-gray-300 mt-4 text-center px-8 z-10">
          Login seamlessly — secure your data with Dhanni Properties.
        </p>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-50 p-8"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isLogin ? `Sign In` : `Create Account`}
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
                  <input id="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                  <input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                  <input id="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                </motion.div>
              )}
            </AnimatePresence>

            <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />

            <div className="relative">
              <input id="password" type={passwordVisible ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              <div onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-indigo-600">
                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
            </div>

            {!isLogin && (
              <div className="relative">
                <input id="confirmPassword" type={confirmVisible ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                <div onClick={() => setConfirmVisible(!confirmVisible)} className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-indigo-600">
                  {confirmVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg text-white transition-all ${
                isLogin ? "bg-indigo-600 hover:bg-indigo-700" : "bg-green-600 hover:bg-green-700"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </motion.button>

            <p onClick={() => setIsLogin(!isLogin)} className="text-center text-indigo-600 hover:underline cursor-pointer mt-2">
              {isLogin ? "New here? Create an account" : "Already have an account? Login"}
            </p>
          </form>

          {/* ✅ Social Login Buttons */}
          <div className="mt-6">
            <p className="text-gray-500 text-center text-sm mb-2">or continue with</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleGoogleSignIn} className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition shadow-sm">
                <FcGoogle className="text-xl" /> Google
              </button>
              <button onClick={handleFacebookSignIn} className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition shadow-sm text-blue-600">
                <FaFacebook className="text-xl" /> Facebook
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
