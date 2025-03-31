import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:3000/api/user"; // Adjust for production

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      // Fetch user profile
      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ user: response.data.data, isLoading: false });
        } catch (error) {
          set({
            user: null,
            error: error.response?.data?.message || "Failed to fetch profile",
            isLoading: false,
          });
        }
      },

      // Update user profile
      updateUserProfile: async (updatedData) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.put(`${API_URL}/profile`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ user: response.data.data, isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update profile",
            isLoading: false,
          });
        }
      },

      // Change user password
      changePassword: async (passwordData) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          await axios.put(`${API_URL}/change-password`, passwordData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to change password",
            isLoading: false,
          });
        }
      },

      // Delete user account
      deleteUserAccount: async (password, navigate) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          await axios.delete(`${API_URL}/delete`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { password }, // Send password in request body
          });

          set({ user: null, isLoading: false });
          localStorage.removeItem("token");
          if (navigate) navigate("/");
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to delete account",
            isLoading: false,
          });
          return false;
        }
      },
    }),
    { name: "user-store" }
  )
);
