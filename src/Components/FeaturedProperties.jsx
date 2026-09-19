import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { BASE_URL } from "../config";

const FeaturedProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = `${BASE_URL}/api/properties`;

        console.log("🌍 API BASE URL:", BASE_URL);
        console.log("🔗 Fetching:", apiUrl);

        if (!BASE_URL) {
          throw new Error("VITE_API_URL is not configured.");
        }

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("📡 API Status:", response.status);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        console.log("✅ API Response:", data);

        if (!isMounted) return;

        if (data?.success && Array.isArray(data.properties)) {
          setProperties(data.properties);
        } else {
          setProperties([]);
          throw new Error("Invalid properties response.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch properties:", err);

        if (isMounted) {
          setError(err.message || "Unable to load properties.");
          setProperties([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  const goToAllProperties = () => {
    navigate("/all-properties");
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-5 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Latest Properties
        </h2>

        {/* Loading */}
        {loading && (
          <div className="py-12 text-gray-500">
            <div className="flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              <span>Loading properties...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-10">
            <p className="text-red-500 font-medium">
              Unable to load properties.
            </p>

            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && properties.length === 0 && (
          <div className="py-10">
            <p className="text-gray-500">No properties available yet.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && properties.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
            {properties.slice(0, 8).map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                hideLikeButton={true}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && (
          <div className="mt-12">
            <button
              onClick={goToAllProperties}
              className="px-10 py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg shadow-md transition duration-300"
            >
              Load More Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
