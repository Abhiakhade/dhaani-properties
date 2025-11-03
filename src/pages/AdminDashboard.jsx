import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaSignOutAlt, FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// BASE_URL assumed to be defined elsewhere or can be replaced with the full URL
const BASE_URL = "http://localhost:5000";

// --------------------- Toast Component (Unchanged) ---------------------
const Toast = ({ message, type, visible, onClose }) => {
  if (!visible) return null;

  const baseClasses =
    "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl transition-opacity duration-300 z-50 flex items-center space-x-3";
  const successClasses = "bg-green-600 text-white";
  const errorClasses = "bg-red-600 text-white";

  const icon = type === "success" ? "✅" : "❌";
  const classes = type === "success" ? successClasses : errorClasses;

  return (
    <div className={`${baseClasses} ${classes}`}>
      <span className="text-xl">{icon}</span>
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 opacity-75 hover:opacity-100 transition-opacity"
      >
        &times;
      </button>
    </div>
  );
};

// --------------------- Metric Card (Unchanged) ---------------------
const MetricCard = ({ title, value, icon, bgColor, colorClass }) => (
  <div
    className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-b-4 ${colorClass}`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-2xl p-2 rounded-full ${bgColor} mr-3`}>
        {icon}
      </span>
      <div className="text-3xl font-extrabold text-gray-900">{value}</div>
    </div>
    <p className="text-sm font-medium text-gray-500 mt-3">{title}</p>
  </div>
);

const DashboardMetrics = ({ counts }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <MetricCard
      title="Total Submissions"
      value={counts.total}
      icon="📦"
      bgColor="bg-indigo-50"
      colorClass="border-indigo-500"
    />
    <MetricCard
      title="Pending Review"
      value={counts.pending}
      icon="⏳"
      bgColor="bg-yellow-50"
      colorClass="border-yellow-500"
    />
    <MetricCard
      title="Approved"
      value={counts.approved}
      icon="✅"
      bgColor="bg-green-50"
      colorClass="border-green-500"
    />
    <MetricCard
      title="Rejected"
      value={counts.rejected}
      icon="🗑️"
      bgColor="bg-red-50"
      colorClass="border-red-500"
    />
  </div>
);

// --------------------- Helper Functions ---------------------

const getStatusTag = (status) => {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${colorMap[status] || "bg-gray-300 text-gray-700"
        }`}
    >
      {status}
    </span>
  );
};

const getCardClasses = (status) => {
  const base =
    "p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between border-t-4 border-b-2";
  const colorMap = {
    pending: "bg-white border-yellow-500",
    approved: "bg-white border-green-500",
    rejected: "bg-white border-red-500",
  };
  return `${base} ${colorMap[status] || "bg-white border-gray-300"}`;
};


// --------------------- Property Card Component with Carousel and Modal ---------------------

const PropertyCard = ({ property, handleApprove, handleReject }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalImages = property.images ? property.images.length : 0;

  // Auto-scroll logic (Carousel)
  useEffect(() => {
    // Only auto-scroll if pending and multiple images exist
    if (totalImages <= 1 || property.status !== "pending") return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % totalImages);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalImages, property.status]);

  // Reset index when status changes 
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property.status]);

  // Modal navigation functions
  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % totalImages);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + totalImages) % totalImages);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div key={property._id} className={getCardClasses(property.status)}>

      {/* Image Carousel Area (Clickable) */}
      <div
        className="relative w-full h-40 overflow-hidden rounded-md mb-3 shadow-md bg-gray-100 cursor-pointer"
        onClick={openModal} // Open modal on click
      >
        {totalImages > 0 ? (
          <img
            src={property.images[currentImageIndex]}
            alt={`Property view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* Carousel Indicator */}
        {totalImages > 1 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {property.images.map((_, index) => (
              <span
                key={index}
                className={`block w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-teal-500 w-3' : 'bg-white bg-opacity-70'
                  }`}
              ></span>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-bold text-gray-900 truncate">
            {property.propertyType || "Property"} - {property.bhk}
          </h3>
          {getStatusTag(property.status)}
        </div>

        <p className="text-2xl font-bold text-teal-600 mb-2">
          <FaMoneyBillWave className="inline mr-1 text-xl" />
          ₹{new Intl.NumberFormat("en-IN").format(property.price)}
        </p>

        <div className="space-y-1 text-xs text-gray-700 pt-2 border-t border-gray-100">
          <p className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-gray-400" />
            <span className="font-semibold">{property.city}</span> ({property.address})
          </p>
          <p className="flex items-center gap-1">
            <FaRulerCombined className="text-gray-400" />
            {property.area} sq ft
          </p>
          <p className="pt-1 text-xs text-gray-500 italic truncate">
            {property.description}
          </p>
          <p className="pt-1 text-xs text-gray-500 italic truncate">
            {property.beds}
          </p>
          <p className="pt-1 text-xs text-gray-500 italic truncate">
            {property.parking}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleApprove(property._id)}
          disabled={property.status !== "pending"}
          className={`flex-1 text-white py-1.5 rounded-md font-semibold text-sm shadow-md transition ${property.status === "pending"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Approve
        </button>
        <button
          onClick={() => handleReject(property._id)}
          disabled={property.status !== "pending"}
          className={`flex-1 text-white py-1.5 rounded-md font-semibold text-sm shadow-md transition ${property.status === "pending"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Reject
        </button>
      </div>

      {/* --------------------- Image Modal --------------------- */}
      {isModalOpen && totalImages > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={property.images[currentImageIndex]}
              alt={`Full view ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-[-20px] right-[-20px] text-white text-5xl font-light opacity-90 hover:opacity-100 transition"
            >
              &times;
            </button>

            {/* Navigation (Siper) Buttons */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg transition"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg transition"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// --------------------- Admin Dashboard (Main Component) ---------------------
const AdminDashboard = () => {
  const [sellProperties, setSellProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [admin, setAdmin] = useState(null);

  const navigate = useNavigate();

  // --------------------- Toast ---------------------
  const showToast = useCallback((message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  // --------------------- Fetch Admin Info ---------------------
  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data.admin);
    } catch (error) {
      console.error("Error fetching admin info:", error);
      navigate("/admin-login");
    }
  };

  // --------------------- Fetch Sell Properties ---------------------
  const fetchSellProperties = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/sell-property`);
      const properties = res.data.properties || [];

      // Stats
      const total = properties.length;
      const pending = properties.filter((p) => p.status === "pending").length;
      const approved = properties.filter((p) => p.status === "approved").length;
      const rejected = properties.filter((p) => p.status === "rejected").length;

      // Sort
      const sorted = properties.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setSellProperties(sorted);
      setCounts({ total, pending, approved, rejected });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching sell-property data:", err);
      showToast("Failed to load property data.", "error");
      setLoading(false);
    }
  };

  // --------------------- Lifecycle ---------------------
  useEffect(() => {
    fetchAdmin();
    fetchSellProperties();
  }, [showToast]);

  // --------------------- Handlers ---------------------
  // --------------------- Handlers ---------------------

  const handleApprove = async (id) => {
    try {
      const confirmApprove = window.confirm(
        "Approve this property and add it to the main collection?"
      );
      if (!confirmApprove) return;

      await axios.put(`${BASE_URL}/api/sell-property/approve/${id}`);

      // Remove approved card from UI
      setSellProperties((prev) => prev.filter((p) => p._id !== id));

      // Update counts dynamically
      setCounts((prev) => ({
        ...prev,
        total: prev.total,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));

      showToast("✅ Property approved and moved to main collection!", "success");
    } catch (err) {
      console.error("Error approving property:", err);
      showToast("Approval failed.", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to reject and delete this property permanently?"
      );
      if (!confirmDelete) return;

      await axios.delete(`${BASE_URL}/api/sell-property/reject/${id}`);

      // Remove rejected card instantly from UI
      setSellProperties((prev) => prev.filter((p) => p._id !== id));

      // Update counts dynamically
      setCounts((prev) => ({
        ...prev,
        total: prev.total - 1,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));

      showToast("❌ Property rejected and deleted successfully.", "success");
    } catch (err) {
      console.error("Error rejecting property:", err);
      showToast("Rejection failed.", "error");
    }
  };



  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    showToast("Logged out successfully!", "success");
    setTimeout(() => navigate("/admin-login"), 1000);
  };

  // --------------------- UI Functions ---------------------

  // Header 
  const DashboardHeader = () => (
    <header className="bg-white text-gray-800 shadow-md p-4 sticky top-0 z-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-teal-600">
          🏠 Property Review
        </h1>
        {admin && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm flex items-center gap-1"><FaUser className="text-teal-500" /> {admin.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1"><FaEnvelope className="text-teal-500" /> {admin.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full shadow-md transition-all duration-200 font-medium text-sm flex items-center gap-1"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );

  // --------------------- Render ---------------------
  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-xl font-medium p-10 bg-white rounded-xl shadow-lg">
          Loading property submissions...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Review Metrics</h2>
        <DashboardMetrics counts={counts} />

        <h2 className="text-2xl font-bold text-gray-800">
          Property Submissions Queue ({counts.pending} Pending)
        </h2>

        {sellProperties.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-inner border border-gray-200">
            <p className="text-lg text-gray-600">
              🎉 No submissions found. All clear!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sellProperties
              .filter((p) => p.status === "pending")
              .map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                />
              ))}

          </div>
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
};

export default AdminDashboard;