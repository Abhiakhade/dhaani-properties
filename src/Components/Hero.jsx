import Select from "react-select";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  MapPin,
  SlidersHorizontal,
  Search as SearchIcon,
} from "lucide-react";
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

  const [dealType, setDealType] = useState("Buy");
  const [city, setCity] = useState(null);
  const [propertyType, setPropertyType] = useState("");
  const [area, setArea] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: 500000, // ₹5L
    max: 50000000, // ₹5Cr
  });

  // ✅ Tracks which slider handle was last grabbed, so it renders on top
  // and stays draggable even when the two handles are close together.
  const [activeThumb, setActiveThumb] = useState(null); // "min" | "max" | null

  // ✅ Budget now lives in a dropdown popover, like most property portals,
  // instead of sitting inline and taking up permanent space in the bar.
  const [budgetOpen, setBudgetOpen] = useState(false);
  const budgetRef = useRef(null);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (budgetRef.current && !budgetRef.current.contains(e.target)) {
        setBudgetOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setBudgetOpen(false);
    };
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

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
        #B8863D ${left}%, 
        #B8863D ${right}%, 
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
    <section className="relative bg-gradient-to-bl from-[#0b021f] via-[#3f1369] to-[#3b0f51] text-white py-32 flex flex-col items-center justify-center text-center px-4 rounded-r-full overflow-hidden group">
      {/* 🏙️ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-800 opacity-0 group-hover:opacity-80"
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

        {/* 🔍 Portal-style search */}
        <div className="w-full max-w-4xl flex flex-col items-center mt-2">
          {/* Tabs — Buy / Rent */}
          <div className="flex gap-8 relative z-10 -mb-px">
            {["Buy", "Rent"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDealType(tab)}
                aria-pressed={dealType === tab}
                className={`px-2 pb-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  dealType === tab
                    ? "border-[#B8863D] text-white"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main search bar */}
          <div
            className="w-full bg-white rounded-full md:rounded-full shadow-[0_25px_60px_-15px_rgba(11,2,31,0.5)]
        flex flex-col md:flex-row items-stretch md:items-center
        divide-y md:divide-y-0 md:divide-x divide-[#E8E4EE]
        p-2 md:p-2 rounded-[28px] md:rounded-full"
          >
            {/* City / Locality */}
            <div className="flex items-center gap-2 flex-1 min-w-0 px-4 py-2.5">
              <MapPin className="w-4 h-4 text-[#B8863D] shrink-0" />
              <div className="flex-1 min-w-0">
                <Select
                  options={cityOptions}
                  placeholder="Search city or locality"
                  isSearchable
                  value={city}
                  onChange={(selected) => setCity(selected)}
                  aria-label="City"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      minHeight: "auto",
                      cursor: "text",
                    }),
                    valueContainer: (base) => ({ ...base, padding: 0 }),
                    indicatorSeparator: () => ({ display: "none" }),
                    dropdownIndicator: () => ({ display: "none" }),
                    placeholder: (base) => ({ ...base, color: "#9691A0" }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#14101B",
                      fontWeight: 500,
                    }),
                    input: (base) => ({ ...base, color: "#14101B" }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "16px",
                      overflow: "hidden",
                    }),
                  }}
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="relative flex items-center px-4 py-2.5 md:w-[160px]">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                aria-label="Property type"
                className="w-full appearance-none bg-transparent border-0 pr-6 text-[#14101B]
            focus:outline-none cursor-pointer"
              >
                <option value="">Property type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#9691A0] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Budget — dropdown popover */}
            <div className="relative md:w-[170px]" ref={budgetRef}>
              <button
                type="button"
                onClick={() => setBudgetOpen((prev) => !prev)}
                aria-expanded={budgetOpen}
                aria-haspopup="true"
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#B8863D] shrink-0" />
                <span className="flex-1 min-w-0 truncate text-[#14101B] text-sm">
                  {formatPrice(priceRange.min)} – {formatPrice(priceRange.max)}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#9691A0] shrink-0 transition-transform duration-200 ${
                    budgetOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {budgetOpen && (
                <div
                  className="absolute z-30 mt-2 left-0 right-0 md:left-auto md:right-0 md:w-[320px]
              bg-white rounded-2xl shadow-xl border border-[#EDE9F3] p-5 text-left"
                >
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs text-[#6E6579]">Budget</span>
                    <span className="text-sm font-medium text-[#14101B]">
                      {formatPrice(priceRange.min)} –{" "}
                      {formatPrice(priceRange.max)}
                    </span>
                  </div>

                  <div
                    className="relative w-full h-1.5 rounded-full overflow-hidden"
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
                          min: Math.min(
                            Number(e.target.value),
                            prev.max - 500000,
                          ),
                        }))
                      }
                      onMouseDown={() => setActiveThumb("min")}
                      onTouchStart={() => setActiveThumb("min")}
                      aria-label="Minimum price"
                      style={{ zIndex: activeThumb === "max" ? 20 : 30 }}
                      className="absolute w-full appearance-none h-1.5 bg-transparent pointer-events-auto 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#B8863D]
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:shadow-md
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
                          max: Math.max(
                            Number(e.target.value),
                            prev.min + 500000,
                          ),
                        }))
                      }
                      onMouseDown={() => setActiveThumb("max")}
                      onTouchStart={() => setActiveThumb("max")}
                      aria-label="Maximum price"
                      style={{ zIndex: activeThumb === "min" ? 20 : 30 }}
                      className="absolute w-full appearance-none h-1.5 bg-transparent pointer-events-auto 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#B8863D]
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  <div className="relative w-full flex justify-between text-[10px] text-[#9691A0] mt-1.5">
                    {priceTicks.map((tick) => (
                      <span key={tick.value}>{tick.label}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setBudgetOpen(false)}
                    className="mt-4 w-full text-center text-sm font-medium text-white bg-[#14101B]
                hover:bg-[#241c33] rounded-full py-2 transition-colors duration-200"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Area */}
            <div className="px-4 py-2.5 md:w-[120px]">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Area sq.ft"
                aria-label="Area in square feet"
                className="w-full bg-transparent border-0 text-[#14101B] placeholder-[#9691A0]
            focus:outline-none"
              />
            </div>

            {/* Search Button */}
            <div className="p-1 md:pl-1">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3
            bg-[#14101B] hover:bg-[#241c33] text-white font-medium rounded-full
            transition-colors duration-300"
              >
                <SearchIcon className="w-4 h-4 text-[#B8863D]" />
                Search
              </button>
            </div>
          </div>

          {/* Popular cities */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/50">Popular:</span>
            {cityOptions.slice(0, 5).map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCity(c)}
                className="px-3 py-1 rounded-full border border-white/25 text-white/80
            hover:border-[#B8863D] hover:text-white transition-colors duration-200"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
  