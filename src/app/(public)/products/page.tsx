"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
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

import { getCategoryTree } from "@/service/category.service";
import { getAllProducts } from "@/service/product.service";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types/product.types";
import ProductLoadingSkeleton from "@/components/products/ProductLoadingSclaton";
import Sidebar from "@/components/products/Sidebar";

type SortOption = "newest" | "price-low" | "price-high";

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

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const brandParam = searchParams.get("brand");
  const searchParam = searchParams.get("search");

  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;

  const selectedCategory = subcategoryParam || categoryParam;
  const selectedBrand = brandParam;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryData = await getCategoryTree();
        setCategories(categoryData.data || []);

        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        const productData = await getAllProducts(params);
        setProducts(productData.data || []);
        setTotalPages(productData.meta?.totalPages || 1);
        setTotalProducts(productData.meta?.total || 0);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        if (product.category && typeof product.category === "object") {
          if (product.category.slug === selectedCategory) return true;
          if (
            product.category.parentCategory &&
            typeof product.category.parentCategory === "object" &&
            product.category.parentCategory.slug === selectedCategory
          ) {
            return true;
          }
        }
        return false;
      });
    }

    if (selectedBrand) {
      filtered = filtered.filter(
        (product) =>
          product.brand?.toLowerCase() === selectedBrand.toLowerCase(),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const updateUrlParams = (updates: {
    category?: string | null;
    subcategory?: string | null;
    brand?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else if (value !== undefined) params.set(key, value);
    });
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
    setSearchQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
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
              categories={categories}
              products={products}
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
                      categories={categories}
                      products={products}
                      selectedCategory={selectedCategory}
                      selectedBrand={selectedBrand}
                      updateUrlParams={updateUrlParams}
                      clearFilters={clearFilters}
                    />
                  </SheetContent>
                </Sheet>

                <p className="text-xs text-muted-foreground italic">
                  {filteredProducts.length} items
                </p>
              </div>

              {/* Badges (Visible on all screens) */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {selectedCategory}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        updateUrlParams({ category: null, subcategory: null })
                      }
                    />
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="secondary" className="gap-1">
                    Brand: {selectedBrand}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateUrlParams({ brand: null })}
                    />
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
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm w-full sm:w-auto focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <ProductLoadingSkeleton />
              </div>
            ) : filteredProducts.length === 0 ? (
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
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination & Stats */}
            {!loading && filteredProducts.length > 0 && (
              <div className="mt-12 flex flex-col items-center gap-6">
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 max-w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Prev
                    </Button>
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const p = i + 1;
                        const isEdge = p === 1 || p === totalPages;
                        const isNear = Math.abs(p - currentPage) <= 1;
                        if (!isEdge && !isNear) return null;
                        return (
                          <Button
                            key={p}
                            variant={currentPage === p ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(p)}
                            className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                          >
                            {p}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Showing page {currentPage} of {totalPages} ({totalProducts}{" "}
                  total items)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="flex min-h-[400px] items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
