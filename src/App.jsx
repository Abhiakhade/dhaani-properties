import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Components
import Nav from "./Components/Nav";
import Hero from "./Components/Hero";
import FeaturedProperties from "./Components/FeaturedProperties";
import AllProperty from "./Components/AllProperty";
import Buy from "./Components/Buy";
import ServicesSection from "./Components/ServicesSection";
import Footer from "./Components/Footer";
import PropertyTypePage from "./Components/PropertyTypePage";
import SellProperty from "./Components/SellProperty";
import Contact from "./Components/Contact";
import Login from "./Components/Login";
import CardInfo from "./Components/CardInfo";

// Pages
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
// Context
import { LikedProvider } from "./context/LikedContext";
import Testimonials from "./Components/Testimonial";

// ------------------- Private Route for Role-Based Access -------------------
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role"); // "user" or "admin"

  if (!token) return <Navigate to="/login" replace />; // Not logged in
  if (role && storedRole !== role) return <Navigate to="/login" replace />; // Wrong role

  return children;
};

// ------------------- Layout to Hide Nav/Footer on Dashboard -------------------
const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout =
    location.pathname.includes("/admin-dashboard");

  return (
    <>
      {!hideLayout && <Nav />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

// ------------------- Main App -------------------
function App() {
  const [count, setCount] = useState(0);

  return (
    <LikedProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <FeaturedProperties />
                  <ServicesSection />
                  <Testimonials />
                </>
              }
            />

            {/* Public Pages */}
            <Route path="/all-properties" element={<AllProperty />} />
            <Route path="/properties/:type" element={<PropertyTypePage />} />
            <Route path="/buy-properties" element={<Buy />} />
            <Route path="/properties/buy" element={<Buy />} />
            <Route path="/services" element={<ServicesSection />} />
            <Route path="/sell-property" element={<SellProperty />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cardinfo" element={<CardInfo />} />

            {/* User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute role="user">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </LikedProvider>
  );
}

export default App;
