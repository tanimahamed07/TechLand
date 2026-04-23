import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";
import { CategoryTree } from "@/types/products-page.types";

interface ServerSidebarProps {
  categories: CategoryTree[];
  products: Product[];
  selectedCategory?: string;
  selectedBrand?: string;
  searchParams: { [key: string]: string | undefined };
}

export default function ServerSidebar({
  categories,
  products,
  selectedCategory,
  selectedBrand,
  searchParams,
}: ServerSidebarProps) {
  // Get unique brands from products
  const brands = Array.from(
    new Set(products.map((product) => product.brand).filter(Boolean)),
  ).sort();

  // Build URL helper
  const buildUrl = (updates: { [key: string]: string | null }) => {
    const params = new URLSearchParams();

    // Start with current params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Always reset to page 1
    params.set("page", "1");

    return `/products${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button asChild variant="ghost" size="sm">
          <Link href="/products">Clear All</Link>
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="mb-3 font-medium text-foreground">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category._id}>
              <Link
                href={buildUrl({
                  category: category.slug,
                  subcategory: null,
                })}
                className={`block text-sm hover:text-primary transition-colors ${
                  selectedCategory === category.slug
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {category.name}
              </Link>

              {/* Subcategories */}
              {category.children && category.children.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.children.map((subcategory) => (
                    <Link
                      key={subcategory._id}
                      href={buildUrl({
                        category: category.slug,
                        subcategory: subcategory.slug,
                      })}
                      className={`block text-xs hover:text-primary transition-colors ${
                        selectedCategory === subcategory.slug
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 className="mb-3 font-medium text-foreground">Brands</h4>
          <div className="space-y-2">
            {brands.slice(0, 10).map((brand) => (
              <Link
                key={brand}
                href={buildUrl({ brand })}
                className={`block text-sm hover:text-primary transition-colors ${
                  selectedBrand === brand
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Price Range - Static for now */}
      <div>
        <h4 className="mb-3 font-medium text-foreground">Price Range</h4>
        <div className="space-y-2">
          <Link
            href={buildUrl({ priceMin: "0", priceMax: "50" })}
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Under $50
          </Link>
          <Link
            href={buildUrl({ priceMin: "50", priceMax: "100" })}
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            $50 - $100
          </Link>
          <Link
            href={buildUrl({ priceMin: "100", priceMax: "500" })}
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            $100 - $500
          </Link>
          <Link
            href={buildUrl({ priceMin: "500", priceMax: null })}
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Over $500
          </Link>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3 font-medium text-foreground">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <Link
              key={rating}
              href={buildUrl({ rating: rating.toString() })}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <div className="flex text-yellow-400 mr-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < rating ? "" : "opacity-30"}>
                    ★
                  </span>
                ))}
              </div>
              & Up
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
