import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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
import Testimonials from "./Components/Testimonial";

// Pages
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Context
import { LikedProvider } from "./context/LikedContext";

// ------------------- Private Route -------------------
const PrivateRoute = ({ children, role }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const storedRole =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ------------------- Layout -------------------
const Layout = ({ children }) => {
  const location = useLocation();

  const hideLayout = location.pathname.includes("/admin-dashboard");

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
  return (
    <LikedProvider>
      <Router>
        <Layout>
          <Routes>
            {/* ================= HOME ================= */}
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

            {/* ================= PUBLIC PAGES ================= */}

            <Route path="/all-properties" element={<AllProperty />} />

            <Route path="/properties/:type" element={<PropertyTypePage />} />

            <Route path="/buy-properties" element={<Buy />} />

            <Route path="/properties/buy" element={<Buy />} />

            <Route path="/services" element={<ServicesSection />} />

            <Route path="/sell-property" element={<SellProperty />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />

            <Route path="/cardinfo" element={<CardInfo />} />

            {/* ================= USER DASHBOARD ================= */}

            <Route
              path="/dashboard"
              element={
                <PrivateRoute role="user">
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* ================= ADMIN ================= */}

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </LikedProvider>
  );
}

export default App;
