import axios, { AxiosError } from "axios";
import type { ApiErrorBody } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorBody>) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function extractApiError(err: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    const data = err.response?.data;
    if (data?.errors && data.errors.length) return data.errors.join(", ");
    if (data?.message) return data.message;
    if (err.response?.status === 401) return "Invalid email or password";
    if (err.response?.status === 503) return "Service unavailable, try again";
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

export function getDuplicateMealId(err: unknown): number | null {
  if (axios.isAxiosError<ApiErrorBody>(err) && err.response?.status === 409) {
    const id = err.response.data?.existingMealId;
    return typeof id === "number" ? id : null;
  }
  return null;
}

export default api;
