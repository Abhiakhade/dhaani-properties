import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { BASE_URL } from "../config"; 

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

// Fetch properties from backend
useEffect(() => {
  console.log("🔗 BASE_URL:", BASE_URL);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/properties`);
      const text = await res.text();
      console.log("🔍 Raw response:", text.slice(0, 300)); // print first 300 chars

      try {
        const data = JSON.parse(text);
        setProperties(data.properties || []);
      } catch (err) {
        console.error("❌ Invalid JSON:", err);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  };

  fetchProperties();
}, []);


  const goToAllProperties = () => {
    navigate("/all-properties");
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <h2 className="text-3xl  md:text-4xl font-bold text-gray-800 mb-12">
          Latest Properties
        </h2>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
          {properties.slice(0, 8).map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              hideLikeButton={true} // 👈 Hides like button only here
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12">
          <button
            onClick={goToAllProperties}
            className="px-10 py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            Load More Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;