import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/components/shared";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function UserLayout() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth); // Get auth check function

  useEffect(() => {
    checkAuth(); // Automatically check authentication on page load
  }, []);
  return (
    <>
      <Navbar user={user} />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
