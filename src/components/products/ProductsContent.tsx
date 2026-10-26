"use client";

import { useState, useTransition } from "react";
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
import { ProductGridSkeleton } from "@/components/products/ProductLoadingSclaton";
import { Product } from "@/types/product.types";
import {
  SortOption,
  CategoryTree,
  ProductsPageMeta,
  UrlParamUpdates,
} from "@/types/products-page.types";
import Sidebar from "@/components/products/Sidebar";

interface ProductsContentProps {
  initialProducts: Product[];
  initialCategories: CategoryTree[];
  meta?: ProductsPageMeta;
}

export default function ProductsContent({
  initialProducts,
  initialCategories,
  meta,
}: ProductsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sortBy") as SortOption) || "newest",
  );
  const [isPending, startTransition] = useTransition();

  const selectedCategory =
    searchParams.get("subcategory") || searchParams.get("category");
  const selectedBrand = searchParams.get("brand");
  const searchParam = searchParams.get("search");

  const updateUrl = (updates: UrlParamUpdates) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined) params.delete(key);
      else params.set(key, value);
    });

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    startTransition(() => {
      router.push("/products");
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUrl({ search: searchQuery.trim() || null });
  };

  const handleSort = (newSort: SortOption) => {
    setSortBy(newSort);
    updateUrl({ sortBy: newSort });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Explore Products</h1>
            <p className="text-muted-foreground">
              Discover our full collection of electronics
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <form onSubmit={handleSearch}>
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
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Sidebar
              categories={initialCategories}
              products={initialProducts}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              updateUrlParams={updateUrl}
              clearFilters={clearFilters}
              isLoading={isPending}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Bar */}
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
                      updateUrlParams={updateUrl}
                      clearFilters={clearFilters}
                      isLoading={isPending}
                    />
                  </SheetContent>
                </Sheet>
                <p className="text-xs text-muted-foreground italic">
                  {meta?.total || initialProducts.length} items
                </p>
              </div>

              {/* Active Filters */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                {searchParam && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchParam}
                    <button
                      onClick={() => updateUrl({ search: null })}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {selectedCategory}
                    <button
                      onClick={() =>
                        updateUrl({ category: null, subcategory: null })
                      }
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="secondary" className="gap-1">
                    Brand: {selectedBrand}
                    <button
                      onClick={() => updateUrl({ brand: null })}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value as SortOption)}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary outline-none"
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
            {isPending ? (
              <ProductGridSkeleton count={12} />
            ) : initialProducts.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                  No products found matching your criteria.
                </p>
                <Button variant="link" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {initialProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {initialProducts.length > 0 &&
              meta &&
              !isPending &&
              meta.totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total} products
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.page - 1)}
                      disabled={meta.page === 1}
                    >
                      Previous
                    </Button>

                    {/* Simple pagination - show current page and nearby pages */}
                    {Array.from(
                      { length: Math.min(10, meta.totalPages) },
                      (_, i) => {
                        const page = Math.max(1, meta.page - 2) + i;
                        if (page > meta.totalPages) return null;
                        return (
                          <Button
                            key={page}
                            variant={page === meta.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-9 h-9 p-0"
                          >
                            {page}
                          </Button>
                        );
                      },
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(meta.page + 1)}
                      disabled={meta.page === meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
