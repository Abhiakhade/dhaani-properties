import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaBed,
  FaCar,
  FaHome,
  FaFileImage,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

// ======================================================
// CONSTANTS
// ======================================================

const MAX_IMAGES = 5;
const MAX_DESCRIPTION_LENGTH = 500;

const INITIAL_FORM_DATA = {
  name: "",
  phone: "",
  address: "",
  city: "",
  propertyType: "",
  type: "",
  bhk: "",
  beds: "",
  parking: "",
  area: "",
  price: "",
  description: "",
};

// ======================================================
// REUSABLE INPUT
// ======================================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      required
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3
                 text-gray-800 outline-none transition
                 placeholder:text-gray-400
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

// ======================================================
// REUSABLE SELECT
// ======================================================

const SelectField = ({ label, name, value, onChange, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label}
    </label>

    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3
                 text-gray-800 outline-none transition
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      {children}
    </select>
  </div>
);

// ======================================================
// FORM SECTION
// ======================================================

const FormSection = ({ title, icon, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>

    {children}
  </section>
);

// ======================================================
// MAIN COMPONENT
// ======================================================

const SellProperty = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);

  // ====================================================
  // CLEANUP IMAGE PREVIEWS
  // ====================================================

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // HANDLE IMAGE UPLOAD
  // ====================================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const files = selectedFiles.slice(0, MAX_IMAGES);

    if (selectedFiles.length > MAX_IMAGES) {
      setMessage(`You can upload a maximum of ${MAX_IMAGES} images.`);
      setMessageType("error");
    }

    // Validate file size
    const validFiles = files.filter((file) => {
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        setMessage(`${file.name} is larger than 5MB and was removed.`);
        setMessageType("error");

        return false;
      }

      return true;
    });

    setImages(validFiles);

    const urls = validFiles.map((file) => URL.createObjectURL(file));

    setPreview(urls);
  };

  // ====================================================
  // REMOVE IMAGE
  // ====================================================

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setPreview((prev) => {
      const updated = [...prev];

      URL.revokeObjectURL(updated[index]);

      updated.splice(index, 1);

      return updated;
    });
  };

  // ====================================================
  // FORMAT PRICE
  // ====================================================

  const formatPrice = (price) => {
    if (!price || Number.isNaN(Number(price))) {
      return "Price";
    }

    return Number(price).toLocaleString("en-IN");
  };

  // ====================================================
  // SUBMIT FORM
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setMessageType("");

    // Basic validation
    if (!BASE_URL) {
      setMessage("Backend URL is not configured. Please check VITE_API_URL.");
      setMessageType("error");
      return;
    }

    if (images.length === 0) {
      setMessage("Please upload at least one property image.");
      setMessageType("error");
      return;
    }

    if (formData.description.trim().length < 20) {
      setMessage(
        "Please provide a property description of at least 20 characters.",
      );
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post(
        `${BASE_URL}/api/sell-property`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.success) {
        setMessage(
          "Your property has been submitted successfully. Our team will review the listing shortly.",
        );

        setMessageType("success");

        setFormData(INITIAL_FORM_DATA);
        setImages([]);
        setPreview([]);

        // Reset file input
        const fileInput = document.getElementById("property-images");

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        throw new Error(response.data?.message || "Unable to submit property.");
      }
    } catch (error) {
      console.error("Property submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Unable to submit your property. Please try again.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* ==============================================
            HEADER
        ============================================== */}

        <div className="mb-10 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FaHome size={26} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            List Your Property
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Provide accurate property details and high-quality images to create
            an attractive listing.
          </p>
        </div>

        {/* ==============================================
            MAIN LAYOUT
        ============================================== */}

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* ============================================
              FORM
          ============================================ */}

          <div className="space-y-8 lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ----------------------------------------
                  CONTACT
              ---------------------------------------- */}

              <FormSection title="Contact & Location" icon={<FaMapMarkerAlt />}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />

                  <InputField
                    label="Contact Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />

                  <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter property address"
                  />

                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
              </FormSection>

              {/* ----------------------------------------
                  PROPERTY DETAILS
              ---------------------------------------- */}

              <FormSection title="Property Details" icon={<FaHome />}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  <SelectField
                    label="Property Type"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="">Select Property Type</option>

                    {["Flat", "House", "Plot", "Office", "Shop"].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    label="Listing Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>

                    <option value="Residential">Residential</option>

                    <option value="Commercial">Commercial</option>
                  </SelectField>

                  <SelectField
                    label="BHK"
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                  >
                    <option value="">Select BHK</option>

                    {[1, 2, 3, 4, 5, 6].map((number) => (
                      <option key={number} value={`${number} BHK`}>
                        {number} BHK
                      </option>
                    ))}
                  </SelectField>

                  <InputField
                    label="Beds"
                    name="beds"
                    type="number"
                    min="0"
                    value={formData.beds}
                    onChange={handleChange}
                    placeholder="Number of beds"
                  />

                  <SelectField
                    label="Parking"
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                  >
                    <option value="">Select Parking</option>

                    <option value="Yes">Available</option>
                    <option value="No">Not Available</option>
                  </SelectField>

                  <InputField
                    label="Area (Sq Ft)"
                    name="area"
                    type="number"
                    min="1"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 1200"
                  />
                </div>

                {/* PRICE */}

                <div className="mt-6">
                  <InputField
                    label="Expected Price (₹)"
                    name="price"
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter expected price"
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Property Description
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </div>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                        handleChange(e);
                      }
                    }}
                    rows={5}
                    required
                    placeholder="Describe the property, key features, amenities, nearby schools, markets, transportation and other important details..."
                    className="w-full resize-none rounded-lg border border-gray-300
                               bg-white px-4 py-3 text-gray-800 outline-none
                               transition placeholder:text-gray-400
                               focus:border-blue-500
                               focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Tip: Mention the property's key features, amenities,
                    location advantages and nearby facilities.
                  </p>
                </div>
              </FormSection>

              {/* ----------------------------------------
                  IMAGES
              ---------------------------------------- */}

              <FormSection
                title={`Property Images (${images.length}/${MAX_IMAGES})`}
                icon={<FaFileImage />}
              >
                <input
                  id="property-images"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer rounded-lg border
                             border-gray-300 bg-white p-3 text-sm
                             file:mr-4 file:rounded-full file:border-0
                             file:bg-blue-50 file:px-4 file:py-2
                             file:font-semibold file:text-blue-700
                             hover:file:bg-blue-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Upload up to 5 images. Maximum 5MB per image.
                </p>

                {/* IMAGE PREVIEW */}

                {preview.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {preview.map((src, index) => (
                      <div
                        key={src}
                        className="group relative h-24 overflow-hidden rounded-xl border border-gray-200"
                      >
                        <img
                          src={src}
                          alt={`Property preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 hidden rounded-full
                                     bg-black/70 px-2 py-1 text-xs text-white
                                     group-hover:block"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FormSection>

              {/* ----------------------------------------
                  SUBMIT
              ---------------------------------------- */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3
                           rounded-xl bg-black py-4 text-lg font-bold
                           uppercase tracking-wide text-white
                           shadow-lg transition
                           hover:bg-gray-800
                           disabled:cursor-not-allowed
                           disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  "Submit Property Listing"
                )}
              </button>
            </form>

            {/* ==========================================
                MESSAGE
            ========================================== */}

            {message && (
              <div
                className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-semibold ${
                  messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {messageType === "success" ? (
                  <FaCheckCircle className="mt-0.5 shrink-0" />
                ) : (
                  <FaExclamationCircle className="mt-0.5 shrink-0" />
                )}

                <span>{message}</span>
              </div>
            )}
          </div>

          {/* ============================================
              LIVE PREVIEW
          ============================================ */}

          <div className="space-y-5 lg:sticky lg:top-8">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <FaHome className="text-blue-600" />
                Live Preview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This is how your property listing will look.
              </p>
            </div>

            {/* PROPERTY CARD */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {/* IMAGE */}

              <div className="relative h-52 bg-gray-100">
                {preview.length > 0 ? (
                  <img
                    src={preview[0]}
                    alt="Property preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-gray-400">
                    Upload property images to preview your listing.
                  </div>
                )}

                {formData.type && (
                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow">
                    {formData.type}
                  </span>
                )}
              </div>

              {/* DETAILS */}

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    {formData.propertyType || "Property Type"}

                    {formData.bhk && ` • ${formData.bhk}`}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-xl font-extrabold text-blue-600">
                    <FaMoneyBillWave className="text-blue-500" />₹
                    {formatPrice(formData.price)}
                  </p>
                </div>

                <p className="flex items-start gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-blue-500" />

                  <span>
                    {formData.address || "Property Address"}
                    {formData.city && `, ${formData.city}`}
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-3 border-y border-gray-100 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaRulerCombined className="text-blue-500" />

                    <span>
                      <strong>{formData.area || "—"}</strong> sq.ft
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaBed className="text-blue-500" />

                    <span>
                      <strong>{formData.beds || "—"}</strong> Beds
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCar className="text-blue-500" />

                    <span>
                      Parking: <strong>{formData.parking || "—"}</strong>
                    </span>
                  </div>
                </div>

                <p className="line-clamp-4 text-sm leading-6 text-gray-500">
                  {formData.description ||
                    "Your property description will appear here. Add key features, amenities and location advantages to make your listing attractive."}
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
