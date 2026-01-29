import { create } from "zustand";
export const useAccountStore = create((set) => ({
    account: null,
  
    setAccount: (account) => {
      sessionStorage.setItem("account", JSON.stringify(account));
      set({ account });
    },
  
    hydrate: () => {
      const stored = sessionStorage.getItem("account");
      if (stored) set({ account: JSON.parse(stored) });
    },
  
    clear: () => {
      sessionStorage.removeItem("account");
      set({ account: null });
    }
  }));
  