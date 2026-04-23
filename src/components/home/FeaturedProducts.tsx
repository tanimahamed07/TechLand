"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "../products/ProductCard";
import { getFeaturedProducts } from "@/service/product.service";
import { Product } from "@/types/product.types";
import { Button } from "../ui/button";

function SkeletonCard() {
  return (
    <div className="card bg-base-100 border border-base-200 overflow-hidden">
      <div className="skeleton aspect-square w-full rounded-none" />
      <div className="card-body p-4 gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-20 rounded mt-1" />
        <div className="skeleton h-9 w-full rounded mt-2" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        console.log("Fetching featured products...");
        const result = await getFeaturedProducts();
        console.log("Featured products result:", result);
        console.log("Featured products data:", result.data);
        console.log("Featured products count:", result.data?.length || 0);
        setProducts(result.data || []);
      } catch (error) {
        console.error("Featured products error:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-base-200/40">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header - Categorized Section UI এর সাথে মিল রেখে */}
        <div className="text-center mb-12">
          <div className="badge badge-primary badge-lg mb-4 px-4 py-3 font-semibold">
            Hand-Picked
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-base-content mb-3">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="text-base-content/60 max-w-xl mx-auto">
            Explore our curated picks loved by thousands of customers around the
            world.
          </p>
        </div>

        {/* Error state */}
        {isError && (
          <div className="alert alert-warning mb-10 max-w-2xl mx-auto">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm">
              Could not load products. Is the server running?
            </span>
          </div>
        )}

        {/* Product Grid - 10 products in 2 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, 10).map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  // First 5 products eager loading for LCP
                  loading={index < 5 ? "eager" : "lazy"}
                />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-base-content mb-2">
              No featured products found
            </h3>
            <p className="text-base-content/60 mb-6">
              Make sure products are marked as featured in admin panel.
            </p>
            <div className="text-xs text-base-content/40 bg-base-200 rounded p-4 max-w-md mx-auto">
              <p>Debug: Fetched {products.length} featured products</p>
              <p>
                API URL:{" "}
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}
              </p>
            </div>
          </div>
        )}

        {/* View All Button - Category Section এর সাথে হুবহু মিল রেখে */}
        <div className="flex justify-center mt-12">
          <Button
            asChild
            variant="outline"
            className="w-fit px-8 h-11 border-slate-200 hover:border-primary hover:text-primary transition-all rounded-full"
          >
            <Link
              href="/products?isFeatured=true"
              className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
            >
              View All Featured
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
