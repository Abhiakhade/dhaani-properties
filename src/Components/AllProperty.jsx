import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { BASE_URL } from "../config";

const AllProperty = ({
  userLikedProperties = [],
  setUserLikedProperties = () => {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/properties`);
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data.properties || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // ✅ Apply filters from URL
  useEffect(() => {
    if (!properties.length) return;

    const params = new URLSearchParams(location.search);
    const dealType = params.get("dealType");
    const city = params.get("city");
    const propertyType = params.get("propertyType");
    const minPrice = parseInt(params.get("minPrice"));
    const maxPrice = parseInt(params.get("maxPrice"));
    const area = parseInt(params.get("area"));

    let filtered = [...properties];

    if (dealType)
      filtered = filtered.filter(
        (p) => p.type?.toLowerCase() === dealType.toLowerCase()
      );

    if (city)
      filtered = filtered.filter(
        (p) => p.location?.toLowerCase() === city.toLowerCase()
      );

    if (propertyType)
      filtered = filtered.filter(
        (p) => p.propertyType?.toLowerCase() === propertyType.toLowerCase()
      );

    // 💰 Price Range Filter
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      filtered = filtered.filter(
        (p) => p.price >= minPrice && p.price <= maxPrice
      );
    }

    // 📏 Area Filter (minimum)
    if (!isNaN(area)) {
      filtered = filtered.filter((p) => p.area >= area);
    }

    setFilteredProperties(filtered);
  }, [location.search, properties]);

  // 🔄 Reset Filters
  const handleResetFilters = () => {
    navigate("/all-properties");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-lg font-medium">Loading properties...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20 text-lg font-semibold">
        {error}
      </p>
    );

  const params = new URLSearchParams(location.search);

  return (
    <section className="bg-gray-50 py-10 lg:mx-20 sm:m-0 my-5">
      <div className="max-w-7xl mx-auto text-center">
        {/* 🏷️ Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
          🏡 Explore Properties
        </h2>

        {/* 🧾 Active Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {params.get("dealType") && (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              Type: {params.get("dealType")}
            </span>
          )}
          {params.get("city") && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              City: {params.get("city")}
            </span>
          )}
          {params.get("propertyType") && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              Property: {params.get("propertyType")}
            </span>
          )}
          {params.get("minPrice") && (
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              Price: ₹
              {(params.get("minPrice") / 100000).toFixed(1)}L – ₹
              {(params.get("maxPrice") / 100000).toFixed(1)}L
            </span>
          )}
          {params.get("area") && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              Min Area: {params.get("area")} sq ft
            </span>
          )}
          {/* Reset Filters Button */}
          {params.toString() && (
            <button
              onClick={handleResetFilters}
              className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition"
            >
              Reset Filters ✖
            </button>
          )}
        </div>

        {/* 🏠 Property Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-gray-600 text-lg font-medium py-16">
            No properties match your filters. Try adjusting them!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                userLikedProperties={userLikedProperties}
                setUserLikedProperties={setUserLikedProperties}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProperty;
