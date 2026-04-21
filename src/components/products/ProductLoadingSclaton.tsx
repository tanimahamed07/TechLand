import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ProductLoadingSkeleton = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-none shadow-sm">
          {/* Image Aspect Square Placeholder */}
          <div className="relative aspect-square animate-pulse bg-muted" />

          <CardContent className="px-4 pt-0 pb-4">
            {/* Brand Placeholder (Upper text) */}
            <div className="mt-4 h-3 w-1/4 animate-pulse rounded bg-muted" />

            {/* Title Placeholder (Two lines) */}
            <div className="mt-2 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>

            {/* Rating Stars Placeholder */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-8 animate-pulse rounded bg-muted" />
            </div>

            {/* Price Placeholder */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
            </div>

            {/* Button Placeholder */}
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ProductLoadingSkeleton;
