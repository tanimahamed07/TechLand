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
import { toast } from "react-hot-toast";
import type { Product } from "@/types/product.types";
import { addToCart } from "@/service/cart.service";
import { toggleWishlist } from "@/service/wishlist.service";

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onWishlistChange?: (productId: string, added: boolean) => void;
}

export const ProductCard = ({
  product,
  isWishlisted = false,
  onWishlistChange,
}: ProductCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) {
      router.push("/login?redirect=/products");
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, 1);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) {
      router.push("/login?redirect=/products");
      return;
    }
    try {
      setTogglingWishlist(true);
      const result = await toggleWishlist(product._id);
      const added = result.message.toLowerCase().includes("added");
      setWishlisted(added);
      onWishlistChange?.(product._id, added);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setTogglingWishlist(false);
    }
  };

  return (
    <div>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute left-3 top-3 z-10 bg-rose-500 hover:bg-rose-500 text-white font-bold">
              -{discount}%
            </Badge>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            disabled={togglingWishlist}
            className={`absolute right-3 top-3 z-10 rounded-full p-2 shadow-md transition-all cursor-pointer ${
              wishlisted
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-500"
            } disabled:cursor-not-allowed disabled:opacity-70`} // বোনাস: ডিজেবল অবস্থায় পয়েন্টার অন্যরকম দেখাবে
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
          </button>

          <Image
            src={
              product.images[0] ||
              "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
            }
            alt={product.title || "Product image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <Link href={`/products/${product._id}`}>
          <CardContent className="px-4 pt-3 pb-4">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {product.brand}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.numReviews || 0})
              </span>
            </div>

            {/* Price */}
            <div className="mt-2 flex items-center gap-2">
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
              className="mt-3 w-full gap-2"
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
        </Link>
      </Card>
    </div>
  );
};
