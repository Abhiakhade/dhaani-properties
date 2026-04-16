// src/api.js
import axios from "axios";
import { BASE_URL } from "./config";

const api = axios.create({
  baseURL: BASE_URL, // ✅ NO /api here
  headers: { "Content-Type": "application/json" },
});

// ---------------- TOKEN INTERCEPTOR ----------------
api.interceptors.request.use((config) => {
  const isAdmin = config.url?.includes("/admin");

  const token = isAdmin
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
