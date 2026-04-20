"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Heart, ShoppingCart, X } from "lucide-react";
import { getCategoryTree } from "@/service/category.service";
import { productService } from "@/service/product.service";
import Image from "next/image";

interface Product {
  _id: string;
  title: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  numReviews: number;
  image: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface CategoryTree {
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
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [categories, setCategories] = React.useState<CategoryTree[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    categoryParam,
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryData = await getCategoryTree();
        setCategories(categoryData.data || []);

        // Fetch all products without category filter
        const productData = await productService.getAllProducts({ limit: 100 });
        setProducts(productData.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        // Check if product's category slug matches
        if (product.category && typeof product.category === "object") {
          return product.category.slug === selectedCategory;
        }
        return false;
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort products
    if (sortBy === "newest") {
      // Keep original order
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory(null);
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
          <aside className="hidden w-64 shrink-0 lg:block">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  {selectedCategory && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                      Category
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-categories"
                          checked={!selectedCategory}
                          onCheckedChange={() => setSelectedCategory(null)}
                        />
                        <Label
                          htmlFor="all-categories"
                          className="cursor-pointer text-sm font-normal"
                        >
                          All Categories
                        </Label>
                      </div>
                      {categories.map((category) => (
                        <div key={category._id}>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={category.slug}
                              checked={selectedCategory === category.slug}
                              onCheckedChange={() =>
                                setSelectedCategory(category.slug)
                              }
                            />
                            <Label
                              htmlFor={category.slug}
                              className="cursor-pointer text-sm font-normal"
                            >
                              {category.name}
                            </Label>
                          </div>
                          {category.children &&
                            category.children.length > 0 && (
                              <div className="ml-6 mt-2 space-y-2">
                                {category.children.map((sub) => (
                                  <div
                                    key={sub._id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={sub.slug}
                                      checked={selectedCategory === sub.slug}
                                      onCheckedChange={() =>
                                        setSelectedCategory(sub.slug)
                                      }
                                    />
                                    <Label
                                      htmlFor={sub.slug}
                                      className="cursor-pointer text-sm font-normal text-muted-foreground"
                                    >
                                      {sub.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
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
                    <button onClick={clearFilters} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square animate-pulse bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="group overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {product.discount && (
                        <Badge className="absolute left-3 top-3 z-10 bg-pink-500 text-white">
                          -{product.discount}%
                        </Badge>
                      )}
                      <button className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-md transition hover:bg-pink-50">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                      <Image
                        src={
                          (product.images && product.images[0]) ||
                          product.image ||
                          "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
                        }
                        alt={product.title || product.name || "Product image"}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        {product.brand}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
                        {product.title || product.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.numReviews || product.reviewCount || 0})
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-lg font-bold text-primary">
                          ৳{product.price.toLocaleString()}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Button className="mt-4 w-full gap-2" size="sm">
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
