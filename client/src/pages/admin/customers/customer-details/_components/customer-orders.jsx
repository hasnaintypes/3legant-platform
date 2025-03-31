"use client";

import { useState } from "react";
import {
  ShoppingBag,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CustomerOrders({ customer }) {
  // Mock orders data
  const [orders] = useState(
    customer.orders.map((orderId, index) => {
      const statuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * (statuses.length - 1))]; // Exclude cancelled most of the time

      // Generate a date within the last 6 months
      const date = new Date();
      date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));

      return {
        id: orderId,
        orderNumber: `ORD-${10000 + index}`,
        date: date.toISOString(),
        status:
          index === customer.orders.length - 1 && index > 0
            ? "cancelled"
            : randomStatus,
        total: Math.floor(Math.random() * 500) + 50,
        items: Math.floor(Math.random() * 5) + 1,
      };
    })
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <Package className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="border-indigo-500 text-indigo-600"
          >
            <ShoppingBag className="mr-1 h-3 w-3" />
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Order History</CardTitle>
        <CardDescription>
          View all orders placed by this customer
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <ShoppingBag className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground">
              This customer hasn't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                    </TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
