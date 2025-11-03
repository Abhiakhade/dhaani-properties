import Select from "react-select";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import HeroHeading from "./HeroHeading";

const Hero = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const popupShown = sessionStorage.getItem("popupShown");
    if (!popupShown) {
      setTimeout(() => setShowModal(true), 1000);
      sessionStorage.setItem("popupShown", "true");
    }
  }, []);

  // City Options
  const cityOptions = [
    { value: "Agra", label: "Agra" },
    { value: "Aligarh", label: "Aligarh" },
    { value: "Vrindavan", label: "Vrindavan" },
    { value: "Mathura", label: "Mathura" },
    { value: "Delhi", label: "Delhi" },
    { value: "Mumbai", label: "Mumbai" },
  ];

  const [dealType, setDealType] = useState("");
  const [city, setCity] = useState(null);
  const [propertyType, setPropertyType] = useState("");
  const [area, setArea] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: 500000, // ₹5L
    max: 50000000, // ₹5Cr
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (dealType) queryParams.append("dealType", dealType);
    if (city) queryParams.append("city", city.value);
    if (propertyType) queryParams.append("propertyType", propertyType);
    if (priceRange) {
      queryParams.append("minPrice", priceRange.min);
      queryParams.append("maxPrice", priceRange.max);
    }
    if (area) queryParams.append("area", area);
    navigate(`/all-properties?${queryParams.toString()}`);
  };

  const formatPrice = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val}`;
  };

  const getTrackStyle = () => {
    const min = 500000;
    const max = 50000000;
    const left = ((priceRange.min - min) / (max - min)) * 100;
    const right = ((priceRange.max - min) / (max - min)) * 100;

    return {
      background: `linear-gradient(to right, 
        #d1d5db ${left}%, 
        #10b981 ${left}%, 
        #10b981 ${right}%, 
        #d1d5db ${right}%)`,
    };
  };

  const priceTicks = [
    { value: 500000, label: "₹5L" },
    { value: 5000000, label: "₹50L" },
    { value: 10000000, label: "₹1Cr" },
    { value: 50000000, label: "₹5Cr" },
  ];

  return (
<section
  className="relative bg-gradient-to-bl from-[#0b021f] via-[#3f1369] to-[#3b0f51] text-white py-32 flex flex-col items-center justify-center text-center px-4 rounded-r-full overflow-hidden group"
>
  {/* 🏙️ Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center transition-opacity duration-800 opacity-10 group-hover:opacity-100"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')",
    }}
  ></div>

  {/* 🌑 Dark Gradient Overlay (cinematic effect) */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent pointer-events-none"></div>

  {/* 🧱 Your Content (stays above overlay) */}
  <div className="relative z-10 w-full flex flex-col items-center">
    <HeroHeading />

     {/* 🔍 Search Bar */}
    <div
      className="text-white rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 
      flex flex-col md:flex-row items-center justify-between w-full max-w-6xl p-6 md:p-6 
      space-y-4 md:space-y-0 md:space-x-4 transition-all duration-300 hover:shadow-3xl"
    >
      {/* Deal Type */}
      <select
        value={dealType}
        onChange={(e) => setDealType(e.target.value)}
        className="bg-white w-full md:w-1/6 px-4 py-3 rounded-xl border border-gray-300 text-black 
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Buy</option>
        <option value="Buy">Buy</option>
        <option value="Rent">Rent</option>
      </select>

      {/* City */}
      <div className="w-full md:w-1/4">
        <Select
          options={cityOptions}
          placeholder="Select City"
          isSearchable
          value={city}
          onChange={(selected) => setCity(selected)}
          className="text-gray-700"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "0.75rem",
              padding: "2px",
              borderColor: "#d1d5db",
              boxShadow: "none",
              "&:hover": { borderColor: "#6366f1" },
            }),
            placeholder: (base) => ({ ...base, color: "#6b7280" }),
          }}
        />
      </div>

      {/* Property Type */}
      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="bg-white w-full md:w-1/5 px-4 py-3 rounded-xl border border-gray-300 text-black 
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Property Type</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Commercial">Commercial</option>
        <option value="Land">Land</option>
      </select>

      {/* Area */}
      <input
        type="number"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Area (sq ft)"
        className="bg-white w-full md:w-1/5 px-4 py-3 rounded-xl border border-gray-300 text-black 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
      />

      {/* 💰 Price Range */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <div className="flex justify-between w-full text-xs text-gray-200 mb-1">
          <span>{formatPrice(priceRange.min)}</span>
          <span>{formatPrice(priceRange.max)}</span>
        </div>

        <div
          className="relative w-full h-2 rounded-lg overflow-hidden"
          style={getTrackStyle()}
        >
          {/* Min slider */}
          <input
            type="range"
            min="500000"
            max="50000000"
            step="500000"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                min: Math.min(Number(e.target.value), prev.max - 500000),
              }))
            }
            className="absolute w-full appearance-none h-2 bg-transparent pointer-events-auto 
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-green-500 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />

          {/* Max slider */}
          <input
            type="range"
            min="500000"
            max="50000000"
            step="500000"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                max: Math.max(Number(e.target.value), prev.min + 500000),
              }))
            }
            className="absolute w-full appearance-none h-2 bg-transparent pointer-events-auto 
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-green-500 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Tick Marks */}
        <div className="relative w-full flex justify-between text-[10px] text-gray-300 mt-1">
          {priceTicks.map((tick) => (
            <span key={tick.value} className="text-center">
              {tick.label}
            </span>
          ))}
        </div>

        <span className="text-sm text-green-300 mt-1 font-semibold">
          {formatPrice(priceRange.min)} – {formatPrice(priceRange.max)}
        </span>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 
        hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl 
        shadow-lg transition-all duration-300"
      >
        Search
      </button>
    </div>
  </div>
</section>

  );
};

export default Hero;
