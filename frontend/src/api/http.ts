import axios, { AxiosHeaders } from "axios";
import { readAuthToken } from "../utils/token.util";

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
});

apiClient.interceptors.request.use((config) => {
  const token = readAuthToken();
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export const API_ORIGIN = apiOrigin;
