import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignInPage, SignUpPage } from "./pages/auth";
import { PrivateRoute, AdminRoute } from "./routers";
import UserLayout from "./layout/userLayout";
import AdminLayout from "./layout/adminLayout";
import {
  LandingPage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  ProfilePage,
  SettingsPage,
  OrdersPage,
  WishlistPage,
} from "./pages/user";
import {
  AdminDashboardPage,
  AddProduct,
  AllProducts,
  CategoriesPages,
  InventoryPage,
  BlogPage,
  ContentPagesPage,
  AllCustomers,
  CustomerDetailsPage,
} from "./pages/admin";
import NotFound from "./pages/not-found";
import OrderSuccessPage from "./pages/user/order-success/page";

export default function Page() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ProductsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <PrivateRoute>
                  <ProductDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PrivateRoute>
                  <WishlistPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <PrivateRoute>
                  <OrderSuccessPage />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            {/* Product section */}
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="products/categories" element={<CategoriesPages />} />
            <Route path="products/inventory" element={<InventoryPage />} />

            {/* Content section */}
            <Route path="content/pages" element={<ContentPagesPage />} />
            <Route path="content/blogs" element={<BlogPage />} />

            {/* Customer section */}
            <Route path="customers" element={<AllCustomers />} />
            <Route path="customers/:id" element={<CustomerDetailsPage />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
