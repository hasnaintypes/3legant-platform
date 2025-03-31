import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api/cart"; // Adjust for production

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,
      isLoading: false,
      error: null,

      // Get cart items
      getCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const cart = response.data.data.cart;
          set({
            cartItems: cart.items || [],
            cartCount: cart.items?.length || 0,
            isLoading: false,
          });
          return cart.items || [];
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch cart items",
            isLoading: false,
          });
          toast.error("Failed to fetch cart items");
          return [];
        }
      },

      // Get cart count
      getCartCount: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.get(`${API_URL}/count`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ cartCount: response.data.data.uniqueItems });
          return response.data.data.uniqueItems;
        } catch (error) {
          console.error("Failed to fetch cart count:", error);
          return 0;
        }
      },

      // Add item to cart
      addToCart: async (productId, quantity = 1, color = "default", size = "default") => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const { cartItems } = get();
          const existingItem = cartItems.find(
            (item) =>
              item.product._id === productId &&
              item.color === color &&
              item.size === size
          );

          if (existingItem) {
            toast.info("Item is already in cart. You can update the quantity instead.");
            set({ isLoading: false });
            return null;
          }

          const response = await axios.post(
            API_URL,
            { productId, quantity, color, size },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const updatedCart = await get().getCart();
          await get().getCartCount();

          set({ isLoading: false });
          toast.success("Item added to cart successfully");
          return response.data.data.cartItem;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to add item to cart",
            isLoading: false,
          });
          toast.error(error.response?.data?.message || "Failed to add item to cart");
          return null;
        }
      },

      // Update cart item quantity
      updateCartItem: async (itemId, quantity) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.put(
            `${API_URL}/${itemId}`,
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const updatedCart = await get().getCart();
          await get().getCartCount();

          set({ isLoading: false });
          toast.success("Cart updated successfully");
          return response.data.data.cartItem;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update cart item",
            isLoading: false,
          });
          toast.error(error.response?.data?.message || "Failed to update cart item");
          return null;
        }
      },

      // Remove item from cart
      removeFromCart: async (itemId) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          await axios.delete(`${API_URL}/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const updatedCart = await get().getCart();
          await get().getCartCount();

          set({ isLoading: false });
          toast.success("Item removed from cart");
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to remove item from cart",
            isLoading: false,
          });
          toast.error(error.response?.data?.message || "Failed to remove item from cart");
          return false;
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          await axios.delete(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            cartItems: [],
            cartCount: 0,
            isLoading: false,
          });
          toast.success("Cart cleared successfully");
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to clear cart",
            isLoading: false,
          });
          toast.error(error.response?.data?.message || "Failed to clear cart");
          return false;
        }
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);
