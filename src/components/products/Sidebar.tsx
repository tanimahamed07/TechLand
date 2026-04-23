import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types/product.types";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { CategoryTree } from "./ProductsContent";

interface SidebarProps {
  categories: CategoryTree[];
  products: Product[];
  selectedCategory: string | null | undefined;
  selectedBrand: string | null | undefined;
  updateUrlParams: (updates: {
    category?: string | null;
    subcategory?: string | null;
    brand?: string | null;
    priceMin?: string | null;
    priceMax?: string | null;
    rating?: string | null;
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
  const searchParams = useSearchParams();
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const selectedRating = searchParams.get("rating");

  const handlePriceFilter = () => {
    updateUrlParams({
      priceMin: priceMin || null,
      priceMax: priceMax || null,
    });
  };

  const handleRatingFilter = (rating: number) => {
    updateUrlParams({
      rating: selectedRating === String(rating) ? null : String(rating),
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {(selectedCategory ||
            selectedBrand ||
            priceMin ||
            priceMax ||
            selectedRating) && (
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
              {categories.map((category) => {
                // Check if this parent category is selected OR any of its children is selected
                const isParentSelected = selectedCategory === category.slug;
                const isAnyChildSelected = category.children?.some(
                  (sub) => selectedCategory === sub.slug,
                );
                const showAsActive = isParentSelected || isAnyChildSelected;

                return (
                  <div key={category._id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={category.slug}
                        checked={isParentSelected}
                        onCheckedChange={() =>
                          updateUrlParams({
                            category: category.slug,
                            subcategory: null,
                            brand: null, // Clear brand when category changes
                          })
                        }
                      />
                      <Label
                        htmlFor={category.slug}
                        className={`cursor-pointer text-sm ${
                          showAsActive ? "font-medium" : "font-normal"
                        }`}
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
                                  category: sub.slug,
                                  subcategory: null,
                                  brand: null, // Clear brand when category changes
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
                );
              })}
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
              {/* Server থেকে আসা filtered products এর unique brands */}
              {products.length > 0 ? (
                Array.from(
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
                  ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No brands available
                </p>
              )}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
              Price Range
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="h-9"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="h-9"
                />
              </div>
              <Button
                onClick={handlePriceFilter}
                size="sm"
                className="w-full"
                variant="secondary"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
              Minimum Rating
            </h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => handleRatingFilter(rating)}
                >
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRating === String(rating)}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="cursor-pointer text-sm font-normal flex items-center gap-1"
                  >
                    {rating}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    & up
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
