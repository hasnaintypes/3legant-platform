"use client";

import * as React from "react";
import {
  BarChart3,
  CreditCard,
  Home,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  User,
  FileText,
  Tag,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
      items: [],
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/admin/orders",
        },
        {
          title: "Pending",
          url: "/admin/orders/pending",
        },
        {
          title: "Shipped",
          url: "/admin/orders/shipped",
        },
        {
          title: "Delivered",
          url: "/admin/orders/delivered",
        },
      ],
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/admin/products",
        },
        {
          title: "Add Product",
          url: "/admin/add-product",
        },
        {
          title: "Categories",
          url: "/admin/products/categories",
        },
        {
          title: "Inventory",
          url: "/admin/products/inventory",
        },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: User,
      items: [
        {
          title: "All Customers",
          url: "/admin/customers",
        },
        {
          title: "Customer Details",
          url: "/admin/customers/:id",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Sales Overview",
          url: "/admin/analytics/sales",
        },
        {
          title: "Customer Insights",
          url: "/admin/analytics/customers",
        },
        {
          title: "Product Performance",
          url: "/admin/analytics/products",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/admin/transactions",
      icon: CreditCard,
      items: [
        {
          title: "All Transactions",
          url: "/admin/transactions",
        },
        {
          title: "Pending",
          url: "/admin/transactions/pending",
        },
        {
          title: "Completed",
          url: "/admin/transactions/completed",
        },
      ],
    },
    {
      title: "Marketing",
      url: "/admin/marketing",
      icon: Tag,
      items: [
        {
          title: "Discounts",
          url: "/admin/marketing/discounts",
        },
        {
          title: "Promotions",
          url: "/admin/marketing/promotions",
        },
      ],
    },
    {
      title: "Content",
      url: "/admin/content",
      icon: FileText,
      items: [
        {
          title: "Pages",
          url: "/admin/content/pages",
        },
        {
          title: "Blog",
          url: "/admin/content/blog",
        },
      ],
    },
    {
      title: "Appearance",
      url: "/admin/appearance",
      icon: Palette,
      items: [
        {
          title: "Themes",
          url: "/admin/appearance/themes",
        },
        {
          title: "Banners",
          url: "/admin/appearance/banners",
        },
        {
          title: "Homepage Layout",
          url: "/admin/appearance/homepage",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        {
          title: "Store Details",
          url: "/admin/settings/store",
        },
        {
          title: "Payment Methods",
          url: "/admin/settings/payment",
        },
        {
          title: "Shipping",
          url: "/admin/settings/shipping",
        },
        {
          title: "Taxes",
          url: "/admin/settings/taxes",
        },
      ],
    },
  ],
};

export function DashboardSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Package className="h-6 w-6" />
          <h1 className="text-xl font-bold ">E-Shop Admin</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
