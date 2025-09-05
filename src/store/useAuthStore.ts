import { create } from "zustand";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { User } from "../types/Authuser";
import { axiosInstance } from "../services/config";

interface useAuthStoreType {
  authUser: User | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  onlineUsers: string[];
}

export const useAuthStore = create<useAuthStoreType>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/checkauth");
      set({ authUser: response.data });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      toast.success("Account created successfully");
      set({ authUser: response.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error signing up:", error);
        toast.error(error.response?.data?.message || "Error signing up");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ authUser: response.data });
      toast.success("Logged in successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error logging in:", error);
        toast.error(error.response?.data?.message || "Error logging in");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while logging in");
      }
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error logging out:", error);
        toast.error(error.response?.data?.message || "Error logging out");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while logging out");
      }
    }
  },
}));
