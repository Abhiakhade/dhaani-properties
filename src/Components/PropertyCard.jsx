import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaBed,
  FaRulerCombined,
  FaParking,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BASE_URL } from "../config";

const PropertyCard = ({
  property,
  userLikedProperties,
  setUserLikedProperties,
  hideLikeButton = false,
}) => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = property.images?.length || 1;
  const propertyId = property._id;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(
      Array.isArray(userLikedProperties) &&
        userLikedProperties.some((p) => p._id === propertyId)
    );
  }, [userLikedProperties, propertyId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % totalImages);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalImages]);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % totalImages);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);

  const handleClick = () => navigate("/cardinfo", { state: { property } });

  const handleLike = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to like properties");

    try {
      const url = liked
        ? `${BASE_URL}/api/user/unlike/${propertyId}`
        : `${BASE_URL}/api/user/like-property/${propertyId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setLiked(!liked);
        setUserLikedProperties(data.likedProperties || []);
      } else {
        alert(data.message || "Failed to update liked properties");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl m-2 sm:m-0"
    >
      <div className="relative">
        <img
          src={
            property.images?.[currentImage] ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={property.title || "Property Image"}
          className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-t-lg"
        />

        {/* Carousel buttons */}
        {totalImages > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
            property.type === "Buy"
              ? "bg-gray-800 text-white"
              : "bg-indigo-500 text-white"
          }`}
        >
          {property.type || "Buy"}
        </span>

        {/* Property category badge */}
        {property.propertyType && (
          <span className="absolute top-3 right-3 px-2 py-1 text-xs sm:text-sm font-semibold rounded-full bg-red-500 text-white">
            {property.propertyType}
          </span>
        )}

        {/* Like button */}
        {!hideLikeButton && (
          <button
            onClick={handleLike}
            className={`absolute bottom-3 right-3 p-2 rounded-full border transition ${
              liked ? "border-green-400 bg-green-100" : "border-gray-300 bg-white"
            }`}
          >
            <FaHeart
              className={`text-sm sm:text-base transition ${
                liked ? "text-green-400 scale-125" : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      {/* Property Info */}
      <div className="p-3 sm:p-4 text-left">
        <h3 className="text-sm sm:text-md md:text-lg font-semibold text-gray-800 truncate">
          {property.title || "Untitled Property"}
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center gap-1">
          <FaMapMarkerAlt className="text-indigo-500" />
          {property.location || "Unknown"}
        </p>
        <p className="text-indigo-800 font-bold text-sm sm:text-md md:text-lg mb-2">
          ₹{property.price || "N/A"}
        </p>

        <div className="flex justify-between text-xs sm:text-sm text-gray-500 border-t pt-3 mt-3">
          <div className="flex items-center gap-1">
            <FaBed className="text-indigo-500" />
            <span>{property.beds || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRulerCombined className="text-indigo-500" />
            <span>{property.area || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaParking className="text-indigo-500" />
            <span>{property.parking || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
