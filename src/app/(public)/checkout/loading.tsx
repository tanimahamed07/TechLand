export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="skeleton h-4 w-12 rounded bg-muted animate-pulse" />
        <div className="skeleton h-3 w-3 rounded bg-muted animate-pulse" />
        <div className="skeleton h-4 w-16 rounded bg-muted animate-pulse" />
        <div className="skeleton h-3 w-3 rounded bg-muted animate-pulse" />
        <div className="skeleton h-4 w-20 rounded bg-muted animate-pulse" />
      </div>

      {/* Title Skeleton */}
      <div className="skeleton h-8 w-32 rounded bg-muted animate-pulse mb-8" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column - Form Skeleton */}
        <div className="space-y-6">
          {/* Shipping Address Skeleton */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="skeleton h-5 w-5 rounded bg-muted animate-pulse" />
              <div className="skeleton h-6 w-32 rounded bg-muted animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="skeleton h-10 w-full rounded bg-muted animate-pulse" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="skeleton h-10 w-full rounded bg-muted animate-pulse" />
                <div className="skeleton h-10 w-full rounded bg-muted animate-pulse" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="skeleton h-10 w-full rounded bg-muted animate-pulse" />
                <div className="skeleton h-10 w-full rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>

          {/* Delivery Zone Skeleton */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="skeleton h-5 w-5 rounded bg-muted animate-pulse" />
              <div className="skeleton h-6 w-28 rounded bg-muted animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-16 w-full rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Order Note Skeleton */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="skeleton h-6 w-24 rounded bg-muted animate-pulse mb-3" />
            <div className="skeleton h-20 w-full rounded bg-muted animate-pulse" />
          </div>

          {/* Security Note Skeleton */}
          <div className="flex items-center gap-2">
            <div className="skeleton h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="skeleton h-4 w-48 rounded bg-muted animate-pulse" />
          </div>
        </div>

        {/* Right Column - Order Summary Skeleton */}
        <div>
          <div className="sticky top-28 rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="skeleton h-6 w-32 rounded bg-muted animate-pulse mb-4" />

            {/* Cart Items Skeleton */}
            <div className="mb-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="skeleton h-12 w-12 rounded-lg bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-full rounded bg-muted animate-pulse" />
                    <div className="skeleton h-3 w-16 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="skeleton h-4 w-16 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>

            <div className="divider my-0" />

            {/* Price Summary Skeleton */}
            <div className="my-4 space-y-2">
              <div className="flex justify-between">
                <div className="skeleton h-4 w-16 rounded bg-muted animate-pulse" />
                <div className="skeleton h-4 w-12 rounded bg-muted animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="skeleton h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="skeleton h-4 w-16 rounded bg-muted animate-pulse" />
              </div>
            </div>

            <div className="divider my-0" />

            {/* Total Skeleton */}
            <div className="mb-4 flex justify-between">
              <div className="skeleton h-6 w-20 rounded bg-muted animate-pulse" />
              <div className="skeleton h-6 w-16 rounded bg-muted animate-pulse" />
            </div>

            {/* Button Skeleton */}
            <div className="skeleton h-12 w-full rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
