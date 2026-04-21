"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product.types";
import { addToCart } from "@/service/cart.service";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  // Calculate discount percentage if discountPrice exists
  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  // Add to cart handler
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!session?.user) {
      router.push("/login?redirect=/products");
      return;
    }

    try {
      setAdding(true);
      await addToCart(product._id, 1);
      // Success feedback
      alert("Product added to cart!");
      // Trigger cart update event
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <Link key={product._id} href={`/products/${product._id}`}>
        <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {discount > 0 && (
              <Badge className="absolute left-3 top-3 z-10 bg-pink-500 text-white">
                -{discount}%
              </Badge>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-md transition hover:bg-pink-50"
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
            <Image
              src={
                product.images[0] ||
                "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
              }
              alt={product.title || "Product image"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>

          {/* pt-0: Image er thik niche jei 16px padding chilo sheta remove korbe. 
              pb-4: Nicher padding (16px) thakbe jate button ta kineer sathe lege na jay.
          */}
          <CardContent className="px-4 pt-0 pb-4">
            <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">
              {product.brand}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
              {product.title}
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
                ({product.numReviews || 0})
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-lg font-bold text-primary">
                ৳{(product.discountPrice || product.price).toLocaleString()}
              </p>
              {product.discountPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ৳{product.price.toLocaleString()}
                </p>
              )}
            </div>
            <Button
              className="mt-4 w-full gap-2"
              size="sm"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {adding ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Adding...
                </>
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
