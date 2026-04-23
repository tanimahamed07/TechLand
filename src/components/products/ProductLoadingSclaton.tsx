export function ProductLoadingSkeleton() {
  return (
    <div className="group overflow-hidden transition-shadow hover:shadow-md border border-muted/60 rounded-lg bg-card">
      {/* Image skeleton - aspect-[4/3] to match ProductCard */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div className="skeleton w-full h-full rounded-none bg-muted animate-pulse" />
      </div>

      {/* Content skeleton - p-3 to match ProductCard exactly */}
      <div className="p-3">
        {/* Brand skeleton - h-3 with exact spacing */}
        <div className="skeleton h-3 w-16 rounded bg-muted animate-pulse" />

        {/* Title skeleton - h-4 single line with mt-0.5 */}
        <div className="skeleton h-4 w-full rounded bg-muted animate-pulse mt-0.5" />

        {/* Rating skeleton - h-3 with mt-1 */}
        <div className="skeleton h-3 w-24 rounded bg-muted animate-pulse mt-1" />

        {/* Price skeleton - h-5 with mt-1.5 */}
        <div className="skeleton h-5 w-20 rounded bg-muted animate-pulse mt-1.5" />

        {/* Button skeleton - h-8 with mt-2.5 */}
        <div className="skeleton h-8 w-full rounded bg-muted animate-pulse mt-2.5" />
      </div>
    </div>
  );
}

// Grid skeleton for multiple products
export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductLoadingSkeleton key={i} />
      ))}
    </div>
  );
}
