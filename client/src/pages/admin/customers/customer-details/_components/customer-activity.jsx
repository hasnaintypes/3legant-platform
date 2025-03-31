"use client";

import { useState } from "react";
import {
  Clock,
  ShoppingCart,
  LogIn,
  Settings,
  CreditCard,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CustomerActivity({ customer }) {
  // Generate mock activity data
  const [activities] = useState(() => {
    // Create 10 random activities over the last 30 days
    const result = [];
    const now = new Date();

    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60)
      );

      const types = ["login", "order", "cart", "settings", "payment"];
      const type = types[Math.floor(Math.random() * types.length)];

      let description = "";
      switch (type) {
        case "login":
          description =
            "Logged in from " +
            [
              "Chrome on Windows",
              "Safari on iPhone",
              "Firefox on Mac",
              "Edge on Windows",
            ][Math.floor(Math.random() * 4)];
          break;
        case "order":
          description =
            "Placed order #ORD-" + (10000 + Math.floor(Math.random() * 1000));
          break;
        case "cart":
          description =
            Math.random() > 0.5
              ? "Added product to cart"
              : "Removed product from cart";
          break;
        case "settings":
          description =
            "Updated account " +
            ["password", "email", "profile information", "preferences"][
              Math.floor(Math.random() * 4)
            ];
          break;
        case "payment":
          description = "Added new payment method";
          break;
      }

      result.push({
        id: `activity-${i}`,
        type,
        description,
        date: date.toISOString(),
      });
    }

    // Sort by date (newest first)
    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />;
      case "order":
        return <Package className="h-4 w-4" />;
      case "cart":
        return <ShoppingCart className="h-4 w-4" />;
      case "settings":
        return <Settings className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>
          Track customer's recent actions and interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(activity.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
