"use client";

import { useEffect, useMemo, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getCategoryTree } from "@/service/category.service";
import { productService } from "@/service/product.service";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types/product.types";
import ProductLoadingSkeleton from "@/components/products/ProductLoadingSclaton";
import Sidebar from "@/components/products/Sidebar";

// Sort options type - শুধু এই page এ ব্যবহার হয়
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

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const brandParam = searchParams.get("brand");

  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;

  // URL params থেকে সরাসরি derive করা (no state sync needed)
  const selectedCategory = subcategoryParam || categoryParam;
  const selectedBrand = brandParam;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryData = await getCategoryTree();
        setCategories(categoryData.data || []);

        // Backend থেকে products fetch করা - category filter সহ
        const params: {
          page: number;
          limit: number;
        } = {
          page: currentPage,
          limit: itemsPerPage,
        };

        // যদি category select থাকে, তাহলে backend query তে যোগ করা
        // কিন্তু backend category filter ObjectId expect করে, slug না
        // তাই আমরা সব products fetch করে client-side filter করব

        const productData = await productService.getAllProducts(params);
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

    // Category দিয়ে filter করা (main category অথবা subcategory)
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        if (product.category && typeof product.category === "object") {
          // Direct category match
          if (product.category.slug === selectedCategory) {
            return true;
          }
          // Parent category match (যদি product এর category একটা subcategory হয়)
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

    // Search query দিয়ে filter করা
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort করা
    if (sortBy === "newest") {
      // Keep original order
    } else if (sortBy === "price-low") {
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

    if (updates.category === null) {
      params.delete("category");
    } else if (updates.category !== undefined) {
      params.set("category", updates.category);
    }

    if (updates.subcategory === null) {
      params.delete("subcategory");
    } else if (updates.subcategory !== undefined) {
      params.set("subcategory", updates.subcategory);
    }

    if (updates.brand === null) {
      params.delete("brand");
    } else if (updates.brand !== undefined) {
      params.set("brand", updates.brand);
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Explore Products
          </h1>
          <p className="text-muted-foreground">
            Discover our full collection of electronics
          </p>
        </div>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <Sidebar
            categories={categories}
            products={products}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            updateUrlParams={updateUrlParams}
            clearFilters={clearFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Filter and Sort Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-primary">
                    {filteredProducts.length}
                  </span>{" "}
                  of <span className="font-medium">{products.length}</span>{" "}
                  products
                </p>
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    Category
                    <button
                      onClick={() =>
                        updateUrlParams({ category: null, subcategory: null })
                      }
                      className="ml-1"
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
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                <ProductLoadingSkeleton></ProductLoadingSkeleton>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredProducts.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // শুধু প্রথম, শেষ, এবং current page এর আশেপাশের পেজ দেখাবে
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="min-w-[40px]"
                        >
                          {pageNumber}
                        </Button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="flex items-center px-2"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
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

            {/* Page Info */}
            {!loading && filteredProducts.length > 0 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • Total {totalProducts}{" "}
                products
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
