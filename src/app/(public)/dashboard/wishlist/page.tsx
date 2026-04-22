"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Heart, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { getMyWishlist } from "@/service/wishlist.service";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product.types";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWishlist = async () => {
    if (!session?.user) return;
    try {
      setRefreshing(true);
      const result = await getMyWishlist();
      setProducts(result.data || []);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return;
      try {
        const result = await getMyWishlist();
        setProducts(result.data || []);
      } catch {
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    load();

    // Listen for wishlist updates from ProductCard
    window.addEventListener("wishlistUpdated", fetchWishlist);
    return () => window.removeEventListener("wishlistUpdated", fetchWishlist);
  }, [session]);

  const handleWishlistChange = (productId: string, added: boolean) => {
    if (!added) {
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          {products.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>
        <Button
          onClick={fetchWishlist}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <div className="rounded-full bg-muted p-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Save products you love by clicking the heart icon
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isWishlisted={true}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
