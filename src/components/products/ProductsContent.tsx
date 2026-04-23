"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types/product.types";
import Sidebar from "@/components/products/Sidebar";

type SortOption = "newest" | "price-low" | "price-high" | "rating" | "popular";

export interface CategoryTree {
  _id: string;
  name: string;
  slug: string;
  children: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
}

interface ProductsContentProps {
  initialProducts: Product[];
  initialCategories: CategoryTree[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ProductsContent({
  initialProducts,
  initialCategories,
  meta,
}: ProductsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const brandParam = searchParams.get("brand");
  const searchParam = searchParams.get("search");
  const sortByParam = searchParams.get("sortBy");

  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState<SortOption>(
    (sortByParam as SortOption) || "newest",
  );

  const selectedCategory = subcategoryParam || categoryParam;
  const selectedBrand = brandParam;

  // Server-side filtering দিয়ে products আসছে, তাই client-side filtering এর দরকার নেই
  const products = initialProducts;

  const updateUrlParams = (updates: {
    category?: string | null;
    subcategory?: string | null;
    brand?: string | null;
    priceMin?: string | null;
    priceMax?: string | null;
    rating?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 when filters change
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else if (value !== undefined) params.set(key, value);
    });
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
    setSearchQuery("");
    setSortBy("newest");
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on search

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/products?${params.toString()}`);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Explore Products
            </h1>
            <p className="text-muted-foreground">
              Discover our full collection of electronics
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <form onSubmit={handleSearchSubmit}>
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar (Hidden on mobile) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Sidebar
              categories={initialCategories}
              products={initialProducts}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              updateUrlParams={updateUrlParams}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filter & Sort Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Mobile Filter Button */}
              <div className="flex items-center gap-2 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] overflow-y-auto"
                  >
                    <SheetHeader className="mb-4 text-left">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <Sidebar
                      categories={initialCategories}
                      products={initialProducts}
                      selectedCategory={selectedCategory}
                      selectedBrand={selectedBrand}
                      updateUrlParams={updateUrlParams}
                      clearFilters={clearFilters}
                    />
                  </SheetContent>
                </Sheet>

                <p className="text-xs text-muted-foreground italic">
                  {meta?.total || products.length} items
                </p>
              </div>

              {/* Badges (Visible on all screens) */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {selectedCategory}
                    <button
                      onClick={() =>
                        updateUrlParams({ category: null, subcategory: null })
                      }
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="secondary" className="gap-1">
                    Brand: {selectedBrand}
                    <button
                      onClick={() => updateUrlParams({ brand: null })}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    handleSortChange(e.target.value as SortOption)
                  }
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm w-full sm:w-auto focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                  No products found matching your criteria.
                </p>
                <Button variant="link" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Stats & Pagination */}
            {products.length > 0 && meta && (
              <div className="mt-12 flex flex-col items-center gap-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                  {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                  products
                </p>

                {/* Pagination Controls */}
                {meta.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.page - 1)}
                      disabled={meta.page === 1}
                      className="px-3"
                    >
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {/* First Page */}
                      {meta.page > 3 && (
                        <>
                          <Button
                            variant={meta.page === 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            className="w-9 h-9 p-0"
                          >
                            1
                          </Button>
                          {meta.page > 4 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {/* Pages around current page */}
                      {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          return (
                            page === meta.page ||
                            page === meta.page - 1 ||
                            page === meta.page + 1 ||
                            page === meta.page - 2 ||
                            page === meta.page + 2
                          );
                        })
                        .map((page) => (
                          <Button
                            key={page}
                            variant={page === meta.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-9 h-9 p-0"
                          >
                            {page}
                          </Button>
                        ))}

                      {/* Last Page */}
                      {meta.page < meta.totalPages - 2 && (
                        <>
                          {meta.page < meta.totalPages - 3 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={
                              meta.page === meta.totalPages
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(meta.totalPages)}
                            className="w-9 h-9 p-0"
                          >
                            {meta.totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.page + 1)}
                      disabled={meta.page === meta.totalPages}
                      className="px-3"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
