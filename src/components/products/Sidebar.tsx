import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import { CategoryTree } from "@/app/(public)/products/page";
import { Product } from "@/types/product.types";

interface SidebarProps {
  categories: CategoryTree[];
  products: Product[];
  selectedCategory: string | null | undefined;
  selectedBrand: string | null | undefined;
  updateUrlParams: (updates: {
    category?: string | null;
    subcategory?: string | null;
    brand?: string | null;
  }) => void;
  clearFilters: () => void;
}

const Sidebar = ({
  categories,
  products,
  selectedCategory,
  selectedBrand,
  updateUrlParams,
  clearFilters,
}: SidebarProps) => {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            {(selectedCategory || selectedBrand) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-xs text-primary hover:text-primary/80"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h4 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                Category
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all-categories"
                    checked={!selectedCategory}
                    onCheckedChange={() =>
                      updateUrlParams({
                        category: null,
                        subcategory: null,
                      })
                    }
                  />
                  <Label
                    htmlFor="all-categories"
                    className="cursor-pointer text-sm font-normal"
                  >
                    All Categories
                  </Label>
                </div>
                {categories.map((category) => (
                  <div key={category._id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={category.slug}
                        checked={selectedCategory === category.slug}
                        onCheckedChange={() =>
                          updateUrlParams({
                            category: category.slug,
                            subcategory: null,
                          })
                        }
                      />
                      <Label
                        htmlFor={category.slug}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {category.name}
                      </Label>
                    </div>
                    {category.children && category.children.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {category.children.map((sub) => (
                          <div
                            key={sub._id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={sub.slug}
                              checked={selectedCategory === sub.slug}
                              onCheckedChange={() =>
                                updateUrlParams({
                                  subcategory: sub.slug,
                                  category: null,
                                })
                              }
                            />
                            <Label
                              htmlFor={sub.slug}
                              className="cursor-pointer text-sm font-normal text-muted-foreground"
                            >
                              {sub.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                Brand
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all-brands"
                    checked={!selectedBrand}
                    onCheckedChange={() => updateUrlParams({ brand: null })}
                  />
                  <Label
                    htmlFor="all-brands"
                    className="cursor-pointer text-sm font-normal"
                  >
                    All Brands
                  </Label>
                </div>
                {/* সব products থেকে unique brands বের করা */}
                {Array.from(
                  new Set(
                    products
                      .map((p) => p.brand)
                      .filter((b) => b && b.trim() !== ""),
                  ),
                )
                  .sort()
                  .map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrand === brand}
                        onCheckedChange={() => updateUrlParams({ brand })}
                      />
                      <Label
                        htmlFor={`brand-${brand}`}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;
