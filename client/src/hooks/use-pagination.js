export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
}) {
  // Calculate the range of page numbers to display
  const getPageRange = () => {
    // If total pages is less than or equal to the number of pagination items to display,
    // return all pages
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate the number of items to display on each side of the current page
    const sideItems = Math.floor((paginationItemsToDisplay - 1) / 2);

    // Calculate the start and end page numbers
    let startPage = Math.max(1, currentPage - sideItems);
    const endPage = Math.min(
      totalPages,
      startPage + paginationItemsToDisplay - 1
    );

    // Adjust if we're near the end
    if (endPage - startPage + 1 < paginationItemsToDisplay) {
      startPage = Math.max(1, endPage - paginationItemsToDisplay + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pages = getPageRange();
  const showLeftEllipsis = pages[0] > 1;
  const showRightEllipsis = pages[pages.length - 1] < totalPages;

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
  };
}
