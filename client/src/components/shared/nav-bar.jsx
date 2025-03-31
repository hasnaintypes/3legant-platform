"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  TicketPercent,
  User,
  Heart,
  LogOut,
  Home,
  ShoppingCart,
  Phone,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

export default function Navbar() {
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { cartCount, getCartCount } = useCartStore();

  // Get user data and fetchUserProfile function from useUserStore
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

  useEffect(() => {
    if (!user && !isLoading) {
      fetchUserProfile();
    }
    // Fetch cart count when component mounts
    getCartCount();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/signin");
  };

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Products", href: "/products", icon: ShoppingCart },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <div className="relative flex-1">
      {/* Notification Banner */}
      {showBanner && (
        <div className="relative bg-primary text-primary-foreground px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <TicketPercent className="h-4 w-4" />
            <span className="text-sm">30% off storewide — Limited time!</span>
            <Button
              variant="link"
              className="text-primary-foreground hover:text-primary-foreground/80 p-0 h-auto text-sm"
              onClick={() => navigate("/products")}
            >
              Shop Now
              <span className="ml-1">→</span>
            </Button>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:text-primary-foreground/80"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-background border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left">3legant.</SheetTitle>
                </SheetHeader>

                <div className="overflow-y-auto h-full">
                  <div className="p-4 space-y-6">
                    {/* User Profile Section */}
                    {user ? (
                      <div className="flex items-center space-x-3 mb-6 p-3 bg-accent/50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>
                            {user.username?.charAt(0) ||
                              user.email?.charAt(0) ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <Button
                          className="w-full"
                          onClick={() => {
                            navigate("/signin");
                            setMobileMenuOpen(false);
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "Sign In"}
                        </Button>
                      </div>
                    )}

                    {/* Main Navigation */}
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <SheetClose asChild key={item.name}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-base h-12"
                            onClick={() => navigate(item.href)}
                          >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                          </Button>
                        </SheetClose>
                      ))}
                    </div>

                    <Separator />

                    {/* User Actions */}
                    {user && (
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-base h-12"
                            onClick={() => navigate("/profile")}
                          >
                            <User className="mr-3 h-5 w-5" />
                            Profile
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-base h-12"
                            onClick={() => navigate("/wishlist")}
                          >
                            <Heart className="mr-3 h-5 w-5" />
                            Favorites
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-base h-12"
                            onClick={() => navigate("/orders")}
                          >
                            <ShoppingBag className="mr-3 h-5 w-5" />
                            Orders
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-base h-12"
                            onClick={() => navigate("/settings")}
                          >
                            <Settings className="mr-3 h-5 w-5" />
                            Settings
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-base h-12 text-destructive"
                            onClick={handleLogout}
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                          </Button>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold"
            >
              3legant.
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="font-medium"
                onClick={() => navigate(item.href)}
              >
                {item.name}
              </Button>
            ))}
          </div>

          {/* Utility Icons */}
          <div className="flex items-center space-x-2">
            {/* Show Avatar if user is logged in, else show Login button */}
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => navigate("/profile")}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/signin")}
                className="hidden md:flex"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Sign In"}
              </Button>
            )}

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/wishlist")}
              className="hidden md:flex"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorites</span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
