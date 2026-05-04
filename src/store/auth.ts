"use client";

import { create } from "zustand";

interface AuthState {
  token: string | null;
  userId: number | null;
  name: string | null;
  hydrated: boolean;
  setAuth: (data: { token: string; userId: number; name: string }) => void;
  clear: () => void;
  hydrate: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  userId: null,
  name: null,
  hydrated: false,
  setAuth: ({ token, userId, name }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("userName", name);
    }
    set({ token, userId, name, hydrated: true });
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    }
    set({ token: null, userId: null, name: null, hydrated: true });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const userIdRaw = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    set({
      token,
      userId: userIdRaw ? Number(userIdRaw) : null,
      name,
      hydrated: true,
    });
  },
}));
