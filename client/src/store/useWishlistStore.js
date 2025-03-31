import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";

const API_URL = "http://localhost:3000/api/wishlist"; // Adjust for production

export const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  },

  // Get wishlist items with pagination
  getWishlist: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${API_URL}?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({
        items: response.data.data.products,
        pagination: response.data.data.pagination,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      set({ loading: false });
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(API_URL, { productId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await get().getWishlist();
      toast.success("Item added to wishlist");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to wishlist"
      );
    } finally {
      set({ loading: false });
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await get().getWishlist();
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove item from wishlist"
      );
    } finally {
      set({ loading: false });
    }
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        items: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasMore: false,
        },
      });
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear wishlist");
    } finally {
      set({ loading: false });
    }
  },

  // Check if item is in wishlist
  isInWishlist: async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/${productId}/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.isInWishlist;
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
      return false;
    }
  },
}));
