"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerDetailsHeader } from "./_components/customer-details-header";
import { CustomerOrders } from "./_components/customer-orders";
import { CustomerAddress } from "./_components/customer-address";
import { CustomerActivity } from "./_components/customer-activity";
import { ComingSoon } from "@/components/shared/coming-soon";

// Mock data based on the provided schema
const MOCK_CUSTOMERS = Array.from({ length: 50 }, (_, i) => {
  const id = `cust-${i + 1}`;
  const firstName = [
    "Alex",
    "Sarah",
    "John",
    "Maria",
    "David",
    "Emma",
    "Michael",
    "Sophia",
    "James",
    "Olivia",
  ][i % 10];
  const lastName = [
    "Thompson",
    "Chen",
    "Smith",
    "Garcia",
    "Kim",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
  ][i % 10];
  const username = `@${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const cities = [
    "San Francisco",
    "Singapore",
    "New York",
    "Madrid",
    "Seoul",
    "London",
    "Toronto",
    "Sydney",
    "Berlin",
    "Tokyo",
  ];
  const city = cities[i % 10];
  const role = i < 5 ? "admin" : "user";
  const avatar =
    i < 10
      ? `https://res.cloudinary.com/dlzlfasou/image/upload/v1736358070/avatar-40-0${
          (i % 5) + 1
        }_cmz0mg.jpg`
      : "";

  return {
    _id: id,
    firstName,
    lastName,
    username,
    email,
    avatar,
    address: role === "admin" ? "123 Admin St" : `${100 + i} Main St`,
    postalCode: `${10000 + i}`,
    city,
    phoneNumber: i % 3 === 0 ? `+1 (555) ${100 + i}-${1000 + i}` : "",
    role,
    cart: i % 4 === 0 ? ["prod-1", "prod-2"] : [],
    orders:
      i % 3 === 0
        ? ["order-1", "order-2", "order-3"]
        : i % 5 === 0
        ? ["order-1"]
        : [],
    createdAt: new Date(Date.now() - i * 86400000 * 10).toISOString(), // Different dates
    updatedAt: new Date(Date.now() - i * 86400000 * 5).toISOString(),
  };
});

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Find customer by ID
  const customer = MOCK_CUSTOMERS.find((c) => c._id === id);

  if (!customer) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">Customer Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The customer you're looking for doesn't exist or has been removed.
        </p>
        <button
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => navigate("/admin/customers")}
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/admin/customers/${id}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the customer
    console.log(`Delete customer with ID: ${id}`);
    navigate("/admin/customers");
  };

  return (
    <div className="p-8">
      <CustomerDetailsHeader
        customer={customer}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Tabs defaultValue="orders" className="mt-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <CustomerOrders customer={customer} />
        </TabsContent>

        <TabsContent value="address" className="mt-6">
          <CustomerAddress customer={customer} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <CustomerActivity customer={customer} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ComingSoon
            title="Customer Settings"
            description="Advanced customer settings and preferences management is coming soon."
            returnPath={`/admin/customers/${id}`}
            returnLabel="Back to Customer Details"
            estimatedTime="Coming in the next update"
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
