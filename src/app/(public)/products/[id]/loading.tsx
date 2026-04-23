export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-muted" />
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>

          {/* Product details skeleton */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image gallery skeleton */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="flex gap-2">
                <div className="h-20 w-20 rounded bg-muted" />
                <div className="h-20 w-20 rounded bg-muted" />
                <div className="h-20 w-20 rounded bg-muted" />
                <div className="h-20 w-20 rounded bg-muted" />
              </div>
            </div>

            {/* Product info skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-6 w-1/2 rounded bg-muted" />
              <div className="h-4 w-1/4 rounded bg-muted" />
              <div className="h-12 w-1/3 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-12 w-32 rounded bg-muted" />
                <div className="h-12 flex-1 rounded bg-muted" />
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="mt-12 space-y-4">
            <div className="flex gap-4">
              <div className="h-10 w-32 rounded bg-muted" />
              <div className="h-10 w-32 rounded bg-muted" />
              <div className="h-10 w-32 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          </div>

          {/* Related products skeleton */}
          <div className="mt-12">
            <div className="mb-6 h-8 w-48 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-4/3 rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
