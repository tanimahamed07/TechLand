import { ProductGridSkeleton } from "@/components/products/ProductLoadingSclaton";

export default function ProductsPageLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="skeleton h-8 w-48 rounded bg-muted animate-pulse mb-2" />
            <div className="skeleton h-4 w-64 rounded bg-muted animate-pulse" />
          </div>
          <div className="w-full md:max-w-md">
            <div className="skeleton h-10 w-full rounded bg-muted animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="skeleton h-6 w-16 rounded bg-muted animate-pulse" />
                <div className="skeleton h-6 w-16 rounded bg-muted animate-pulse" />
              </div>

              {/* Categories Skeleton */}
              <div>
                <div className="skeleton h-5 w-20 rounded bg-muted animate-pulse mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="skeleton h-4 w-full rounded bg-muted animate-pulse"
                    />
                  ))}
                </div>
              </div>

              {/* Brands Skeleton */}
              <div>
                <div className="skeleton h-5 w-16 rounded bg-muted animate-pulse mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="skeleton h-4 w-3/4 rounded bg-muted animate-pulse"
                    />
                  ))}
                </div>
              </div>

              {/* Price Range Skeleton */}
              <div>
                <div className="skeleton h-5 w-24 rounded bg-muted animate-pulse mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="skeleton h-4 w-20 rounded bg-muted animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Bar Skeleton */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 lg:hidden">
                <div className="skeleton h-8 w-20 rounded bg-muted animate-pulse" />
                <div className="skeleton h-4 w-16 rounded bg-muted animate-pulse" />
              </div>

              <div className="hidden sm:flex flex-wrap items-center gap-2">
                <div className="skeleton h-6 w-24 rounded-full bg-muted animate-pulse" />
                <div className="skeleton h-6 w-32 rounded-full bg-muted animate-pulse" />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="skeleton h-4 w-8 rounded bg-muted animate-pulse" />
                <div className="skeleton h-8 w-40 rounded bg-muted animate-pulse" />
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <ProductGridSkeleton count={12} />

            {/* Pagination Skeleton */}
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="skeleton h-4 w-64 rounded bg-muted animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="skeleton h-9 w-20 rounded bg-muted animate-pulse" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-9 w-9 rounded bg-muted animate-pulse"
                  />
                ))}
                <div className="skeleton h-9 w-16 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
