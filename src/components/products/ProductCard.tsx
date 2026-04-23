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
import { getValidImageUrl } from "@/utils/imageUtils";



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
    <Card className="group overflow-hidden transition-shadow hover:shadow-md border-muted/60">
      {/* ইমেজ সেকশন: aspect-square এর বদলে aspect-[4/3] করে উচ্চতা কমানো হয়েছে */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {discount > 0 && (
          <Badge className="absolute left-2 top-2 z-10 bg-rose-500 text-[10px] h-5 px-1.5 font-bold">
            -{discount}%
          </Badge>
        )}

        <button
          onClick={handleToggleWishlist}
          disabled={togglingWishlist}
          className={`absolute right-2 top-2 z-10 rounded-full p-1.5 shadow-sm transition-all ${
            wishlisted
              ? "bg-rose-500 text-white"
              : "bg-card/80 text-muted-foreground hover:bg-card hover:text-rose-500"
          } disabled:opacity-70`}
        >
          <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-white" : ""}`} />
        </button>

        <Image
          src={getValidImageUrl(product.images)}
          alt={product.title}
          width={400}
          height={300}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105 w-full h-full"
          loading="eager"
        />
      </div>

      <Link href={`/products/${product._id}`}>
        <CardContent className="p-3">
          {" "}
          {/* প্যাডিং কমানো হয়েছে */}
          <p className="text-[10px] font-bold uppercase text-muted-foreground/80 leading-tight">
            {product.brand}
          </p>
          <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-foreground">
            {product.title}
          </h3>
          {/* রেটিং সেকশন ছোট করা হয়েছে */}
          <div className="mt-1 flex items-center gap-1">
            <div className="flex text-[10px]">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-muted-foreground"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">
              ({product.numReviews || product.reviewCount || 0})
            </span>
          </div>
          {/* প্রাইস সেকশন */}
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <p className="text-base font-bold text-primary">
              ${(product.discountPrice || product.price).toLocaleString()}
            </p>
            {product.discountPrice && (
              <p className="text-xs text-muted-foreground line-through opacity-70">
                ${product.price.toLocaleString()}
              </p>
            )}
          </div>
          <Button
            className="mt-2.5 w-full h-8 text-xs gap-1.5 shadow-none"
            size="sm"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {adding ? (
              <span className="loading loading-spinner loading-xs h-3 w-3" />
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
};
