import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let apiOrigin = API_BASE_URL;
try {
  apiOrigin = new URL(API_BASE_URL).origin;
} catch (error) {
  if (typeof window !== "undefined" && window.location) {
    apiOrigin = window.location.origin;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const API_ORIGIN = apiOrigin;
