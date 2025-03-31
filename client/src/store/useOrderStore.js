import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api/orders"; // Adjust for production

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      order: null,
      pagination: null,
      isLoading: false,
      error: null,

      // Create a new order
      createOrder: async (orderData) => {
        try {
          // Validate required fields
          if (!orderData.items || orderData.items.length === 0) {
            throw new Error("No items in order");
          }
          if (
            !orderData.shippingAddress ||
            !orderData.shippingMethod ||
            !orderData.paymentMethod
          ) {
            throw new Error("Missing required order information");
          }

          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.post(API_URL, orderData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
          toast.success("Order created successfully");
          return response.data.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to create order",
            isLoading: false,
          });
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to create order"
          );
          return null;
        }
      },

      // Get user orders with pagination
      getUserOrders: async (page = 1, limit = 10) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.get(
            `${API_URL}?page=${page}&limit=${limit}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set({
            orders: response.data.data.orders,
            pagination: response.data.data.pagination,
            isLoading: false,
          });
          return response.data.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch orders",
            isLoading: false,
          });
          toast.error(
            error.response?.data?.message || "Failed to fetch orders"
          );
          return null;
        }
      },

      // Get order by ID
      getOrderById: async (orderId) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.get(`${API_URL}/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ order: response.data.data.order, isLoading: false });
          return response.data.data.order;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch order",
            isLoading: false,
          });
          toast.error(error.response?.data?.message || "Failed to fetch order");
          return null;
        }
      },

      // Get all orders (admin only)
      getAdminOrders: async (page = 1, limit = 10, status = null) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const queryParams = new URLSearchParams({
            page: page,
            limit: limit,
            ...(status && { status }),
          });

          const response = await axios.get(
            `${API_URL}/admin/all?${queryParams.toString()}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set({
            orders: response.data.data.orders,
            pagination: response.data.data.pagination,
            isLoading: false,
          });
          return response.data.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to fetch orders",
            isLoading: false,
          });
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to fetch orders"
          );
          return null;
        }
      },

      // Update order status (admin only)
      updateOrderStatus: async (orderId, status) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.put(
            `${API_URL}/${orderId}`,
            { status },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set({ isLoading: false });
          toast.success("Order status updated successfully");
          return response.data.data.order;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to update order status",
            isLoading: false,
          });
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to update order status"
          );
          return null;
        }
      },

      // Clear order state
      clearOrderState: () => {
        set({
          order: null,
          error: null,
        });
      },

      // Clear orders list
      clearOrdersList: () => {
        set({
          orders: [],
          pagination: null,
          error: null,
        });
      },
    }),
    {
      name: "order-storage",
      getStorage: () => localStorage,
    }
  )
);
