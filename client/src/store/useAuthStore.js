import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  login: (user) => {
    sessionStorage.setItem(
      "auth",
      JSON.stringify({ isAuthenticated: true, user })
    );

    set({
      isAuthenticated: true,
      user
    });
  },

  hydrate: () => {
    const stored = sessionStorage.getItem("auth");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    set(parsed);
  },

  logout: () => {
    sessionStorage.removeItem("auth");
    set({
      isAuthenticated: false,
      user: null
    });
  }
}));
