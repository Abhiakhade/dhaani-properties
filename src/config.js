// src/config.js

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined");
}

console.log("🌍 API BASE URL:", BASE_URL);

export { BASE_URL };
