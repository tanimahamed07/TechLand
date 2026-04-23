import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductsPageMeta } from "@/types/products-page.types";

interface ServerPaginationProps {
  meta: ProductsPageMeta;
  searchParams: { [key: string]: string | undefined };
}

export default function ServerPagination({
  meta,
  searchParams,
}: ServerPaginationProps) {
  // Build URL for page change
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Preserve all current params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value);
      }
    });

    // Set new page
    params.set("page", page.toString());

    return `/products?${params.toString()}`;
  };

  if (meta.totalPages <= 1) return null;

  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      <p className="text-sm text-muted-foreground">
        Showing {(meta.page - 1) * meta.limit + 1} to{" "}
        {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} products
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        {meta.page > 1 ? (
          <Button asChild variant="outline" size="sm" className="px-3">
            <Link href={buildPageUrl(meta.page - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="px-3">
            Previous
          </Button>
        )}

        <div className="flex items-center gap-1">
          {/* First page + ellipsis */}
          {meta.page > 3 && (
            <>
              <Button
                asChild
                variant={meta.page === 1 ? "default" : "outline"}
                size="sm"
                className="w-9 h-9 p-0"
              >
                <Link href={buildPageUrl(1)}>1</Link>
              </Button>
              {meta.page > 4 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
            </>
          )}

          {/* Page numbers around current page */}
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page === meta.page ||
                page === meta.page - 1 ||
                page === meta.page + 1 ||
                page === meta.page - 2 ||
                page === meta.page + 2
              );
            })
            .map((page) => (
              <Button
                key={page}
                asChild
                variant={page === meta.page ? "default" : "outline"}
                size="sm"
                className="w-9 h-9 p-0"
              >
                <Link href={buildPageUrl(page)}>{page}</Link>
              </Button>
            ))}

          {/* Last page + ellipsis */}
          {meta.page < meta.totalPages - 2 && (
            <>
              {meta.page < meta.totalPages - 3 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                asChild
                variant={meta.page === meta.totalPages ? "default" : "outline"}
                size="sm"
                className="w-9 h-9 p-0"
              >
                <Link href={buildPageUrl(meta.totalPages)}>
                  {meta.totalPages}
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Next Button */}
        {meta.page < meta.totalPages ? (
          <Button asChild variant="outline" size="sm" className="px-3">
            <Link href={buildPageUrl(meta.page + 1)}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="px-3">
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
