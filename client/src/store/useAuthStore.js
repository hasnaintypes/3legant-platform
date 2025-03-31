import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth"; // Adjust for production

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      signup: async (userData, navigate) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(`${API_URL}/signup`, userData);
          const { user, token } = response.data.data;
          set({ user, token, isLoading: false });
          localStorage.setItem("token", token);

          // Navigate inside the component, not here
          navigate(user.role === "admin" ? "/admin/dashboard" : "/");
        } catch (error) {
          set({
            error: error.response?.data?.message,
            isLoading: false,
          });
        }
      },

      signin: async (credentials, navigate) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.post(`${API_URL}/signin`, credentials);
          console.log(response);
          const { user, token } = response.data.data;
          set({ user, token, isLoading: false });
          localStorage.setItem("token", token);

          // Navigate inside the component, not here
          navigate(user.role === "admin" ? "/admin/dashboard" : "/");
        } catch (error) {
          set({
            error: error.response?.data?.message,
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await axios.post(
            `${API_URL}/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${get().token}` },
            }
          );
          set({ user: null, token: null, isLoading: false });
          localStorage.removeItem("token");
        } catch (error) {
          set({
            error: error.response?.data?.message || "Logout failed",
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");
          const response = await axios.get(`${API_URL}/checkauth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { user } = response.data.data;
          set({ user, token, isLoading: false });
        } catch (error) {
          set({
            user: null,
            token: null,
            error: "Session expired",
            isLoading: false,
          });
          localStorage.removeItem("token");
        }
      },
    }),
    { name: "auth-store" }
  )
);
