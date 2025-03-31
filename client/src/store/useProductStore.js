import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:3000/api/products"; // Adjust for production

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      product: null,
      pagination: null,
      categories: [],
      brands: [],
      featuredProducts: [],
      saleProducts: [],
      isLoading: false,
      error: null,

      // Get all products with filtering, sorting, and pagination
      getProducts: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });

          // Build query string from params
          const queryParams = new URLSearchParams();
          for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
              queryParams.append(key, params[key]);
            }
          }

          const response = await axios.get(
            `${API_URL}?${queryParams.toString()}`
          );
          set({
            products: response.data.data.products,
            pagination: response.data.data.pagination,
            isLoading: false,
          });
          return response.data.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch products",
            isLoading: false,
          });
          return null;
        }
      },

      // Get a single product by ID
      getProductById: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(`${API_URL}/${id}`);
          set({ product: response.data.data.product, isLoading: false });
          return response.data.data.product;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch product",
            isLoading: false,
          });
          return null;
        }
      },

      // Get featured products
      getFeaturedProducts: async (limit = 8) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(
            `${API_URL}/featured?limit=${limit}`
          );
          set({
            featuredProducts: response.data.data.products,
            isLoading: false,
          });
          return response.data.data.products;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to fetch featured products",
            isLoading: false,
          });
          return [];
        }
      },

      // Get products on sale
      getProductsOnSale: async (limit = 8) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(`${API_URL}/sale?limit=${limit}`);
          set({ saleProducts: response.data.data.products, isLoading: false });
          return response.data.data.products;
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to fetch sale products",
            isLoading: false,
          });
          return [];
        }
      },

      // Get product categories
      getProductCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(`${API_URL}/categories`);
          set({ categories: response.data.data.categories, isLoading: false });
          return response.data.data.categories;
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to fetch categories",
            isLoading: false,
          });
          return [];
        }
      },

      // Get product brands
      getProductBrands: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axios.get(`${API_URL}/brands`);
          set({ brands: response.data.data.brands, isLoading: false });
          return response.data.data.brands;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch brands",
            isLoading: false,
          });
          return [];
        }
      },

      // Create a new product (admin only)
      createProduct: async (productData) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.post(API_URL, productData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
          return response.data.data.product;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to create product",
            isLoading: false,
          });
          return null;
        }
      },

      // Update a product (admin only)
      updateProduct: async (id, productData) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await axios.put(`${API_URL}/${id}`, productData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
          return response.data.data.product;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update product",
            isLoading: false,
          });
          return null;
        }
      },

      // Delete a product (admin only)
      deleteProduct: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to delete product",
            isLoading: false,
          });
          return false;
        }
      },

      // Clear product state
      clearProductState: () => {
        set({
          product: null,
          error: null,
        });
      },

      // Clear products list
      clearProductsList: () => {
        set({
          products: [],
          pagination: null,
          error: null,
        });
      },
    }),
    { name: "product-store" }
  )
);
