// src/api.js
import axios from "axios";
import { BASE_URL } from "./config"; // ✅ Correct import

const api = axios.create({
   baseURL: `${BASE_URL}/api`, // ✅ includes /api
  // baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const adminEndpoints = ["/api/admin", "/api/admin/me", "/api/admin/login"];
  const isAdmin = adminEndpoints.some((url) => config.url?.includes(url));

  const token = isAdmin
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default api;
