import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import API from "../api"; // ✅ Use your centralized API instance

const PropertyTypePage = ({
  userLikedProperties = [],
  setUserLikedProperties = () => {},
}) => {
  const { type } = useParams(); // e.g. "buy", "rent", "sell"
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
  try {
    const res = await API.get("/properties");
    const data = res.data;

    const filtered = (data.properties || []).filter(
      (property) =>
        property.propertyType &&
        property.propertyType.toLowerCase() === type.toLowerCase()
    );

    setFilteredProperties(filtered);
  } catch (err) {
    console.error("Error fetching properties:", err);
    setError("Failed to fetch properties. Please try again later.");
  } finally {
    setLoading(false);
  }
};
    fetchProperties();
  }, [type]);

  if (loading)
    return (
      <p className="text-center text-gray-700 mt-20 animate-pulse">
        Loading properties...
      </p>
    );

  if (error)
    return <p className="text-center text-red-500 mt-20">{error}</p>;

  return (
    <section className="bg-gray-50 py-10 lg:mx-20 sm:m-0 my-5">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 m-10">
          {type.charAt(0).toUpperCase() + type.slice(1)} Properties
        </h2>

        {filteredProperties.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No {type} properties found!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
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

export default PropertyTypePage;
