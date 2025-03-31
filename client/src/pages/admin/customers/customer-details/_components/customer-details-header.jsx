"use client";

import {
  ArrowLeft,
  Edit,
  Trash,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function CustomerDetailsHeader({ customer, onEdit, onDelete }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/customers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Customer Details</h1>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm md:flex-row md:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {customer.avatar ? (
              <img
                src={customer.avatar || "/placeholder.svg"}
                alt={`${customer.firstName} ${customer.lastName}`}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-medium text-primary">
                {getInitials(customer.firstName, customer.lastName)}
              </div>
            )}
          </div>

          {/* Customer info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-col items-center gap-2 md:flex-row">
                <h2 className="text-xl font-bold">{`${customer.firstName} ${customer.lastName}`}</h2>
                <Badge
                  className={
                    customer.role === "admin" ? "bg-amber-500" : "bg-green-500"
                  }
                >
                  {customer.role === "admin" ? "Admin" : "Customer"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{customer.username}</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>

              {customer.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phoneNumber}</span>
                </div>
              )}

              {customer.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {customer.address
                      ? `${customer.address}, ${customer.city}`
                      : customer.city}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-2 md:flex-col">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={onDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2 md:flex-shrink-0">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <ShoppingBag className="mb-2 h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{customer.orders.length}</span>
            <span className="text-xs text-muted-foreground">Orders</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <ShoppingCart className="mb-2 h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{customer.cart.length}</span>
            <span className="text-xs text-muted-foreground">Cart Items</span>
          </div>
        </div>
      </div>

      <Separator />
    </div>
  );
}
