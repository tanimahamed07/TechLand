import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  title?: string;
  name?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount?: number;
  numReviews?: number;
  image?: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div>
      <Link key={product._id} href={`/products/${product._id}`}>
        <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.discount && (
              <Badge className="absolute left-3 top-3 z-10 bg-pink-500 text-white">
                -{product.discount}%
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
                (product.images && product.images[0]) ||
                product.image ||
                "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
              }
              alt={product.title || product.name || "Product image"}
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
            <Button
              className="mt-4 w-full gap-2"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
