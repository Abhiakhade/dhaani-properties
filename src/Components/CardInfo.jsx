import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBed, FaRulerCombined, FaCar, FaMapMarkerAlt, FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiHomeGarage, GiHouse, GiMoneyStack } from "react-icons/gi";
import { IoDiamondOutline } from "react-icons/io5";

const CardInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Assume property structure: { title, location, price, images: [], beds, area, parking, type, propertyType, description }
  const property = location.state?.property;

  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg p-8 rounded-lg shadow-md bg-white">
          🚫 No property data found. Please go back and select a listing.
        </p>
      </div>
    );
  }

  const totalImages = property.images ? property.images.length : 0;
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % totalImages);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
  const openModal = (index) => {
    setCurrentImage(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Helper function for dynamic feature icons
  const getFeatureIcon = (feature) => {
      switch (feature) {
          case 'beds': return <FaBed className="text-xl text-teal-600" />;
          case 'area': return <FaRulerCombined className="text-xl text-teal-600" />;
          case 'parking': return <GiHomeGarage className="text-xl text-teal-600" />;
          case 'price': return <GiMoneyStack className="text-xl text-teal-600" />;
          case 'type': return <GiHouse className="text-xl text-teal-600" />;
          default: return <IoDiamondOutline className="text-xl text-teal-600" />;
      }
  }

  const mainFeatures = [
      { label: property.beds || 'N/A', unit: 'Beds', icon: 'beds' },
      { label: property.area || 'N/A', unit: 'Area', icon: 'area' },
      { label: property.parking || 'N/A', unit: 'Parking', icon: 'parking' },
      { label: property.propertyType || 'N/A', unit: 'Type', icon: 'type' },
  ];


  return (
    <div className="min-h-70vh bg-gray-50 py-7 px-4 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2.5 bg-gray-800 text-white font-semibold rounded-full hover:bg-teal-600 transition duration-300 shadow-lg flex items-center gap-2"
        >
          <FaChevronLeft className="text-sm" /> Back to Listings
        </button>

        {/* Header & Price */}
        <div className="flex justify-between items-start flex-wrap mb-6">
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-1 text-gray-900 leading-tight">{property.title}</h1>
                <p className="text-gray-600 flex items-center gap-2 text-lg mb-2">
                    <FaMapMarkerAlt className="text-orange-500" /> {property.location}
                </p>
            </div>
            <div className="text-right mt-4 sm:mt-0">
                <p className="text-3xl sm:text-4xl font-black text-teal-700 tracking-wider">
                    ₹{property.price || 'Price on Request'}
                </p>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    <FaTag className="inline mr-1 text-orange-500"/> Listed Price
                </p>
            </div>
        </div>

        {/* Images & Thumbnails Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            
            {/* Main Carousel (Col-span 10) */}
            {/* Added p-2 (padding) to the container to create a clean border/padding effect */}
            <div className="relative lg:col-span-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 hover:shadow-3xl bg-gray-200 p-2"> 
                {property.images && property.images.length > 0 && (
                    <img
                        src={property.images[currentImage]}
                        alt={`Property view ${currentImage + 1}`}
                        // Crucial Change: object-cover -> object-contain to show the full image
                        // Height reduced to h-32rem (desktop) for a slightly smaller image
                        className="w-full h-[24rem] sm:h-[30rem] lg:h-[32rem] object-contain cursor-pointer transition duration-500 ease-in-out" 
                        onClick={() => openModal(currentImage)}
                    />
                )}

                {/* Prev/Next buttons (Enhanced Style) */}
                {totalImages > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-teal-600 text-white rounded-full p-3 shadow-xl transition-all duration-300 z-10"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-teal-600 text-white rounded-full p-3 shadow-xl transition-all duration-300 z-10"
                        >
                            <FaChevronRight />
                        </button>
                        <span className="absolute bottom-4 right-4 bg-black/60 text-white text-sm font-medium px-3 py-1 rounded-full">
                            {currentImage + 1} / {totalImages}
                        </span>
                    </>
                )}
            </div>

            {/* Thumbnail Navigation (Col-span 2) */}
            {totalImages > 1 && (
                <div className="lg:col-span-2 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[30rem] p-1">
                    {property.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className={`flex-shrink-0 w-24 h-24 object-cover rounded-lg border-3 transition-all duration-300 shadow-md cursor-pointer 
                                ${currentImage === index 
                                    ? "border-teal-600 ring-2 ring-teal-300 transform scale-105" 
                                    : "border-gray-300 opacity-70 hover:opacity-100"
                                }`}
                            onClick={() => setCurrentImage(index)}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* Features & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Features Card (Col 1) */}
            <div className="lg:col-span-1 bg-white p-3 rounded-xl shadow-lg border-l-4 border-teal-500">
                <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">Key Features</h2>
                <div className="space-y-4">
                    {mainFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
                            <div className="flex items-center gap-3">
                                {getFeatureIcon(feature.icon)}
                                <span className="font-medium text-gray-700">{feature.unit}</span>
                            </div>
                            <span className="font-extrabold text-lg text-teal-800">{feature.label}</span>
                        </div>
                    ))}
                    
                    {/* Placeholder/Extra Detail */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                            <FaRulerCombined className="text-xl text-teal-600" />
                            <span className="font-medium text-gray-700">Property Type</span>
                        </div>
                        <span className="font-extrabold text-lg text-teal-800">{property.type || 'Residential'}</span>
                    </div>
                </div>
            </div>

            {/* Description Card (Col 2 & 3) */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 border-b-2 border-orange-300 pb-2">Property Overview</h2>
                {property.description ? (
                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{property.description}</p>
                ) : (
                    <p className="text-gray-500 italic">No detailed description available for this property.</p>
                )}
            </div>
        </div>

      </div>
       {/* Image Modal */}
       {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeModal}
        >
          {/* Modal Image */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
             <img
                src={property.images[currentImage]}
                alt={`Modal ${currentImage + 1}`}
                // Use object-contain here too for full image view in modal
                className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl shadow-2xl transition-transform duration-500 transform scale-100"
              />
              {/* Modal Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-[-2rem] right-0 text-white text-5xl font-light opacity-90 hover:opacity-100 transition"
              >
                &times;
              </button>
              {/* Modal Nav Buttons */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-[-4rem] top-1/2 -translate-y-1/2 text-white text-5xl opacity-80 hover:opacity-100 transition hidden md:block"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-[-4rem] top-1/2 -translate-y-1/2 text-white text-5xl opacity-80 hover:opacity-100 transition hidden md:block"
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

export default CardInfo;