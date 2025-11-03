import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { BASE_URL } from "../config";
import { useLocation } from "react-router-dom";

const Buy = ({ userLikedProperties = [], setUserLikedProperties = () => {} }) => {
  const [buyProperties, setBuyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchBuyProperties = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/properties`);
        if (!res.ok) throw new Error("Failed to fetch properties");

        const data = await res.json();
        const properties = data.properties || [];

        // ✅ Extract query params (optional filters)
        const params = new URLSearchParams(location.search);
        const city = params.get("city");
        const propertyType = params.get("propertyType");

        // ✅ Filter only "Buy" type
        let filtered = properties.filter(
          (p) => p.type?.toLowerCase() === "buy"
        );

        // ✅ Optional filters
        if (city)
          filtered = filtered.filter(
            (p) => p.location?.toLowerCase() === city.toLowerCase()
          );

        if (propertyType)
          filtered = filtered.filter(
            (p) => p.propertyType?.toLowerCase() === propertyType.toLowerCase()
          );

        setBuyProperties(filtered);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyProperties();
  }, [location.search]);

  if (loading)
    return (
      <p className="text-center text-gray-700 mt-20 text-lg">
        Loading properties...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20 text-lg">{error}</p>
    );

  return (
    <section className="bg-gray-50 py-10 lg:mx-20 sm:m-0 my-5">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 m-10">
          🏠 Buy Properties
        </h2>

        {buyProperties.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No buy properties found!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {buyProperties.map((property) => (
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

export default Buy;
