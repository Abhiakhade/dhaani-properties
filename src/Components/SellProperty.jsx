import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config"; 
import { 
  FaMapMarkerAlt, 
  FaRulerCombined, 
  FaMoneyBillWave, 
  FaBed, 
  FaCar, 
  FaHome, 
  FaUser, 
  FaPhoneAlt,
  FaFileImage
} from "react-icons/fa";

// --- Helper Components ---

/**
 * Reusable input field with modern styling.
 */
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div className="space-y-1">
    <label className="block text-gray-700 font-medium text-sm">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 shadow-sm transition duration-150 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

/**
 * Reusable select field with modern styling.
 */
const SelectField = ({ label, name, value, onChange, children }) => (
  <div className="space-y-1">
    <label className="block text-gray-700 font-medium text-sm">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 rounded-lg p-3 shadow-sm transition duration-150 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
    >
      {children}
    </select>
  </div>
);

/**
 * Section wrapper for grouping form fields.
 */
const FormSection = ({ title, icon, children }) => (
  <div className="border border-gray-200 p-6 rounded-xl shadow-lg bg-white transition duration-300 hover:shadow-xl">
    <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3 flex items-center">
      <span className="mr-3 text-blue-600">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

// --- Main Component ---

const SellProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    propertyType: "",
    type: "", // Residential/Commercial
    bhk: "",
    beds: "",
    parking: "",
    area: "", // Sq Ft
    price: "", // INR
    description: "",
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState("");

  // Clean up preview URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      preview.forEach(URL.revokeObjectURL);
    };
  }, [preview]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and create URL previews
  const handleImageChange = (e) => {
    // Limit to 5 files
    const files = Array.from(e.target.files).slice(0, 5); 
    setImages(files);
    
    // Create new previews
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreview(filePreviews);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value)
    );
    images.forEach((img) => formDataToSend.append("images", img));

    try {
      // NOTE: Ensure your BASE_URL and backend endpoint are correct
      const res = await axios.post(`${BASE_URL}/api/sell-property`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage("✅ Listing Successful! Our team will review your submission shortly.");
        // Reset form
        setFormData({
          name: "", phone: "", address: "", city: "", propertyType: "", type: "", bhk: "", beds: "", parking: "", area: "", price: "", description: "",
        });
        setImages([]);
        setPreview([]);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      setMessage("❌ Submission Failed. Please ensure all fields are correct and try again.");
    }
  };

  // Function to format price with commas for INR
  const formatPrice = (price) => {
    if (!price || isNaN(Number(price))) return "Price";
    // Indian number system formatting (Lakhs, Crores)
    return Number(price).toLocaleString('en-IN'); 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center justify-center">
                <FaHome className="mr-3 text-blue-600" /> List Your Property
            </h1>
            <p className="text-gray-600 text-lg">
                Complete the form to submit your property for sale. Maximum 5 high-quality images.
            </p>
        </div>
        
        {/* --- Main Grid Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* --- Left: Form (2/3 width) --- */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Contact Section */}
              <FormSection title="Contact & Location" icon={<FaMapMarkerAlt />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                  <InputField label="Contact Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
                  <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                </div>
              </FormSection>

              {/* Property Details */}
              <FormSection title="Property Details" icon={<FaHome />}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  
                  <SelectField label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleChange}>
                    <option value="">Select Type</option>
                    {["Flat", "House", "Plot", "Office", "Shop"].map(type => (<option key={type} value={type}>{type}</option>))}
                  </SelectField>

                  <SelectField label="Listing Type" name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </SelectField>

                  <SelectField label="BHK" name="bhk" value={formData.bhk} onChange={handleChange}>
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6].map((num) => (<option key={num} value={`${num} BHK`}>{num} BHK</option>))}
                  </SelectField>

                  <InputField label="Beds" name="beds" type="number" value={formData.beds} onChange={handleChange} />
                  
                  <SelectField label="Parking" name="parking" value={formData.parking} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </SelectField>

                  <InputField label="Area (Sq Ft)" name="area" type="number" value={formData.area} onChange={handleChange} />
                </div>

                <div className="mt-6 space-y-6">
                    <InputField label="Expected Price (₹)" name="price" type="number" value={formData.price} onChange={handleChange} />

                    <div>
                        <label className="block text-gray-700 font-medium text-sm mb-1">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 shadow-sm transition duration-150 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="A detailed description helps sell your property faster. Highlight key features, amenities, and proximity to important places."
                        />
                    </div>
                </div>

              </FormSection>

              {/* Image Upload */}
              <FormSection title="Property Images (Max 5)" icon={<FaFileImage />}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm border border-gray-300 rounded-lg p-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {/* Image Previews */}
                {preview.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                        {preview.map((src, index) => (
                            <div key={index} className="relative w-full h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img src={src} alt={`Property preview ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
              </FormSection>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 mt-4 rounded-xl font-extrabold text-xl uppercase hover:bg-gray-800 transition duration-300 shadow-xl tracking-wider"
              >
                Submit Property Listing
              </button>
            </form>

            {/* Submission Message */}
            {message && (
              <p
                className={`mt-6 text-center text-base font-semibold p-4 rounded-xl ${
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                    : "bg-red-100 text-red-800 border-l-4 border-red-500"
                } transition duration-300`}
              >
                {message}
              </p>
            )}
          </div>

          {/* --- Right: Real-Time Preview (1/3 width, smaller card) --- */}
          <div className="lg:col-span-1 sticky top-12 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaHome className="mr-2 text-blue-500" /> Live Listing Preview
            </h2>

            {/* Property Card */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition duration-300">
              
              {/* Image Area */}
              <div className="h-44 bg-gray-100 relative">
                {preview.length > 0 ? (
                  <img
                    src={preview[0]}
                    alt="Property Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 font-medium bg-gray-200/50">
                    Upload an image to see a preview
                  </div>
                )}
                {formData.type && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {formData.type}
                    </span>
                )}
              </div>

              {/* Details */}
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-extrabold text-gray-900 truncate">
                  {formData.propertyType || "Property Type"} {formData.bhk ? `- ${formData.bhk}` : ''}
                </h3>
                
                <p className="text-blue-600 font-extrabold text-2xl flex items-center gap-2">
                  <FaMoneyBillWave className="text-blue-400" /> ₹{formatPrice(formData.price)}
                </p>
                
                <p className="text-gray-600 flex items-start gap-2 text-sm">
                  <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" /> 
                  <span className="truncate">{formData.address || "Street Address"}, {formData.city || "City"}</span>
                </p>

                <div className="flex flex-wrap gap-4 text-gray-700 text-sm pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <FaRulerCombined className="text-blue-500" /> 
                    <span className="font-semibold">{formData.area || 0}</span> sq.ft
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBed className="text-blue-500" /> 
                    <span className="font-semibold">{formData.beds || 0}</span> Beds
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCar className="text-blue-500" /> 
                    Parking: <span className="font-semibold">{formData.parking || "N/A"}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 italic line-clamp-3 pt-2">
                  {formData.description || "Property description will appear here... keep it brief and attractive for the main card view."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProperty;