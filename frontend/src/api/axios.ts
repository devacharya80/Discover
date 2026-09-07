// .env
// VITE_API_BASE_URL=http://localhost:5000/api

import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept outgoing requests and modify config
api.interceptors.request.use(
  (config) => {
    // Example: attach an authorization bearer token if present
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // You MUST return config
  },
  (error) => {
    return Promise.reject(error);
  }
);