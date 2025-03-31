"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent className="w-full justify-between gap-3">
          <PaginationItem>
            <Button
              variant="ghost"
              className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={currentPage === 1 ? true : undefined}
              onClick={handlePrevious}
            >
              <ArrowLeftIcon
                className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                size={16}
                aria-hidden="true"
              />
              Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={currentPage === totalPages ? true : undefined}
              onClick={handleNext}
            >
              Next
              <ArrowRightIcon
                className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                aria-hidden="true"
              />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
