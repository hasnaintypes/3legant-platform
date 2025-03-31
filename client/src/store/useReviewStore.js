import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const API_URL = "http://localhost:3000/api/reviews"; // Adjust for production

export const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [],
      review: null,
      pagination: null,
      myReviews: [],
      reviewStats: null,
      isLoading: false,
      error: null,

      // Get reviews for a product
      getProductReviews: async (productId, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          // Build query string from params
          const queryParams = new URLSearchParams(params).toString();
          const queryString = queryParams ? `?${queryParams}` : "";

          const response = await axios.get(
            `${API_URL}/product/${productId}${queryString}`
          );
          set({
            reviews: response.data.data.reviews,
            pagination: response.data.data.pagination,
            isLoading: false,
          });
          return response.data.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch reviews",
            isLoading: false,
          });
          return null;
        }
      },

      // Get a single review by ID
      getReviewById: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(`${API_URL}/${id}`);
          set({ review: response.data.data.review, isLoading: false });
          return response.data.data.review;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch review",
            isLoading: false,
          });
          return null;
        }
      },

      // Get my reviews
      getMyReviews: async () => {
        try {
          set({ isLoading: true, error: null });
          const token = useAuthStore.getState().token;
          if (!token) throw new Error("No token found");

          const response = await axios.get(`${API_URL}/myreviews`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ myReviews: response.data.data.reviews, isLoading: false });
          return response.data.data.reviews;
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to fetch my reviews",
            isLoading: false,
          });
          return [];
        }
      },

      // Create a new review
      createReview: async (reviewData) => {
        try {
          set({ isLoading: true, error: null });
          const token = useAuthStore.getState().token;
          if (!token) throw new Error("No token found");

          const response = await axios.post(API_URL, reviewData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
          return response.data.data.review;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to create review",
            isLoading: false,
          });
          return null;
        }
      },

      // Update a review
      updateReview: async (id, reviewData) => {
        try {
          set({ isLoading: true, error: null });
          const token = useAuthStore.getState().token;
          if (!token) throw new Error("No token found");

          const response = await axios.put(`${API_URL}/${id}`, reviewData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
          return response.data.data.review;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update review",
            isLoading: false,
          });
          return null;
        }
      },

      // Delete a review
      deleteReview: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const token = useAuthStore.getState().token;
          if (!token) throw new Error("No token found");

          await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to delete review",
            isLoading: false,
          });
          return false;
        }
      },

      // Get review statistics for a product
      getReviewStats: async (productId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(`${API_URL}/stats/${productId}`);
          set({ reviewStats: response.data.data.stats, isLoading: false });
          return response.data.data.stats;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to fetch review statistics",
            isLoading: false,
          });
          return null;
        }
      },

      // Clear review state
      clearReviewState: () => {
        set({
          review: null,
          error: null,
        });
      },

      // Clear reviews list
      clearReviewsList: () => {
        set({
          reviews: [],
          pagination: null,
          error: null,
        });
      },

      // Clear my reviews
      clearMyReviews: () => {
        set({
          myReviews: [],
          error: null,
        });
      },
    }),
    { name: "review-store" }
  )
);
