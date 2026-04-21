import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { Product } from "@/types/product.types";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Related Products
          {products.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({products.length})
            </span>
          )}
        </h2>
        <Link href="/products">
          <Button variant="ghost" className="gap-2">
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No related products found
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((relatedProduct) => (
            <Card
              key={relatedProduct._id}
              className="group overflow-hidden transition-shadow hover:shadow-lg"
            >
              <Link href={`/products/${relatedProduct._id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {relatedProduct.discountPrice && (
                    <Badge className="absolute left-3 top-3 z-10 bg-pink-500 text-white">
                      -
                      {Math.round(
                        ((relatedProduct.price - relatedProduct.discountPrice) /
                          relatedProduct.price) *
                          100,
                      )}
                      %
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
                      relatedProduct.images[0] ||
                      "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
                    }
                    alt={relatedProduct.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>

              <CardContent className="px-4 pt-0 pb-4">
                <Link href={`/products/${relatedProduct._id}`}>
                  <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">
                    {relatedProduct.brand}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground hover:text-primary">
                    {relatedProduct.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(relatedProduct.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({relatedProduct.numReviews})
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <p className="text-lg font-bold text-primary">
                      ৳
                      {(
                        relatedProduct.discountPrice || relatedProduct.price
                      ).toLocaleString()}
                    </p>
                    {relatedProduct.discountPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ৳{relatedProduct.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Add to Cart Button */}
                <Button
                  className="mt-4 w-full gap-2"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Add to cart functionality
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
