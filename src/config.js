// --------------------- config.js ---------------------

let BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Fallback to localhost if not set
if (!BASE_URL) {
  BASE_URL = window.location.origin.includes("localhost")
    ? "http://localhost:5000"
    : window.location.origin; // works for ngrok and production
  console.warn(`⚠️ Using fallback BASE_URL: ${BASE_URL}`);
}

console.log("🌍 BASE_URL:", BASE_URL);

export { BASE_URL };
