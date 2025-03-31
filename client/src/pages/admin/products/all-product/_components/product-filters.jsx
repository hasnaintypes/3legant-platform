import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function ProductFilters({
  onSearch,
  onFilterChange,
  onSortChange,
  activeFilters,
  categories,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter((c) => c !== category)
      : [...activeFilters.categories, category];

    onFilterChange({
      ...activeFilters,
      categories: newCategories,
    });
  };

  const handleFilterToggle = (filter) => {
    if (filter === "categories" || filter === "priceRange") return;

    onFilterChange({
      ...activeFilters,
      [filter]: !activeFilters[filter],
    });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      inStock: false,
      featured: false,
      onSale: false,
      priceRange: null,
    });
    setSearchQuery("");
    onSearch("");
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.categories.length > 0 ||
      activeFilters.inStock ||
      activeFilters.featured ||
      activeFilters.onSale ||
      activeFilters.priceRange !== null
    );
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => {
                setSearchQuery("");
                onSearch("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {hasActiveFilters() && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-center">
                    {activeFilters.categories.length +
                      Number(activeFilters.inStock) +
                      Number(activeFilters.featured) +
                      Number(activeFilters.onSale) +
                      Number(activeFilters.priceRange !== null)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Products</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Categories
                </DropdownMenuLabel>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={activeFilters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Product Status
                </DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.inStock}
                  onCheckedChange={() => handleFilterToggle("inStock")}
                >
                  In Stock
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.featured}
                  onCheckedChange={() => handleFilterToggle("featured")}
                >
                  Featured
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.onSale}
                  onCheckedChange={() => handleFilterToggle("onSale")}
                >
                  On Sale
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {hasActiveFilters() && (
                <DropdownMenuItem
                  onClick={clearFilters}
                  className="justify-center text-center"
                >
                  Clear All Filters
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select onValueChange={onSortChange} defaultValue="newest">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
              <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
              <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {category}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              />
            </Badge>
          ))}

          {activeFilters.inStock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              In Stock
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterToggle("inStock")}
              />
            </Badge>
          )}

          {activeFilters.featured && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Featured
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterToggle("featured")}
              />
            </Badge>
          )}

          {activeFilters.onSale && (
            <Badge variant="secondary" className="flex items-center gap-1">
              On Sale
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterToggle("onSale")}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
