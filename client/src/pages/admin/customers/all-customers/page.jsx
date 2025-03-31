import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { CustomerTable } from "./_components/customer-table";

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

export default function AllCustomers() {
  const navigate = useNavigate();
  const [customers] = useState(MOCK_CUSTOMERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  // Get current customers
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers
  const handleViewCustomer = (id) => {
    navigate(`/admin/customers/${id}`);
  };

  const handleEditCustomer = (id) => {
    navigate(`/admin/customers/${id}/edit`);
  };

  const handleDeleteCustomer = (id) => {
    // In a real app, you would call an API to delete the customer
    console.log(`Delete customer with ID: ${id}`);
  };

  const handleAddCustomer = () => {
    navigate("/admin/customers/new");
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your customers, view their details, and track their orders
          </p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Separator className="mb-6" />

      <CustomerTable
        customers={currentCustomers}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                aria-disabled={currentPage === 1 ? true : undefined}
              />
            </PaginationItem>

            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                aria-disabled={currentPage === totalPages ? true : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
