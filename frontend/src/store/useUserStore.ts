import {create} from "zustand"
import type { User } from "../types/data-types"
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/verify`, {
        withCredentials: true,
      });
      const data = response.data;

      if (data.success) {
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      set({ user: null, isLoading: false });
    }
  },
}));