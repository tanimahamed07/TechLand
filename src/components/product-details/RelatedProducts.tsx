"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types/product.types";
import { ProductCard } from "@/components/products/ProductCard";

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
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
