import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

export function OrdersTable({ orders }) {
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalAmount = orders.reduce((sum, order) => sum + order.price, 0);

  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 w-[40px]">
              <Checkbox
                checked={
                  selectedOrders.length === orders.length && orders.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="h-11">Order ID</TableHead>
            <TableHead className="h-11 hidden md:table-cell">Date</TableHead>
            <TableHead className="h-11">Product</TableHead>
            <TableHead className="h-11 hidden sm:table-cell">Status</TableHead>
            <TableHead className="h-11 text-right">Amount</TableHead>
            <TableHead className="h-11 text-right hidden sm:table-cell">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order._id)}
                  onCheckedChange={() => handleSelectOrder(order._id)}
                />
              </TableCell>
              <TableCell className="font-medium">{order._id}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(order.date)}
              </TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {getStatusBadge(order.orderStatus)}
              </TableCell>
              <TableCell className="text-right">
                ${order.subtotal + order.shippingCost}
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" title="View Order">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Download Invoice">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={3} className="hidden md:table-cell">
              Total
            </TableCell>
            <TableCell colSpan={2} className="md:hidden">
              Total
            </TableCell>
            <TableCell className="text-right">
              ${totalAmount.toFixed(2)}
            </TableCell>
            <TableCell className="hidden sm:table-cell"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
