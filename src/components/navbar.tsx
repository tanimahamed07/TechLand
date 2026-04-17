"use client";

import * as React from "react"; // React import করুন স্টেট ম্যানেজমেন্টের জন্য
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

const categories = [
  {
    name: "Cameras",
    subcategories: [
      { name: "Mirrorless", brands: ["Canon", "Sony"] },
      { name: "Action Cameras", brands: [] },
      { name: "DSLR", brands: [] },
    ],
  },
  { name: "Laptops", subcategories: [] },
  { name: "Headphones", subcategories: [] },
  { name: "Tablets", subcategories: [] },
  { name: "Smartphones", subcategories: [] },
  { name: "Smart Watches", subcategories: [] },
];

export function Navbar() {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-xl font-bold text-foreground">TechLand</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 md:flex md:max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, brands..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Heart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white">
              2
            </Badge>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary p-0 text-xs text-primary-foreground">
              3
            </Badge>
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-border">
        <div className="container mx-auto flex h-12 max-w-7xl items-center px-4">
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/products"
              className="text-sm font-bold hover:text-primary"
            >
              All Products
            </Link>

            {categories.map((category) => (
              <div
                key={category.name}
                onMouseEnter={() => setOpenMenu(category.name)}
                onMouseLeave={() => setOpenMenu(null)}
                className="relative"
              >
                <DropdownMenu open={openMenu === category.name}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm font-bold text-foreground transition-colors hover:text-primary outline-none">
                      {category.name}
                    </button>
                  </DropdownMenuTrigger>

                  {category.subcategories.length > 0 && (
                    <DropdownMenuContent
                      className="min-w-[400px] p-6"
                      align="start"
                      // মাউস কন্টেন্ট এর ওপর থাকলেও যেন মেনু বন্ধ না হয়
                      onMouseEnter={() => setOpenMenu(category.name)}
                    >
                      <div className="grid grid-cols-2 gap-8 divide-x divide-border">
                        <div className="pr-4">
                          <h4 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                            Categories
                          </h4>
                          <div className="space-y-2">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                href={`/products?category=${category.name.toLowerCase()}&subcategory=${sub.name.toLowerCase()}`}
                                className="block text-sm hover:text-primary"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {category.subcategories.some(
                          (sub) => sub.brands.length > 0,
                        ) && (
                          <div className="pl-4">
                            <h4 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                              Brands
                            </h4>
                            <div className="space-y-2">
                              {category.subcategories
                                .flatMap((s) => s.brands)
                                .map((brand) => (
                                  <Link
                                    key={brand}
                                    href={`/products?brand=${brand.toLowerCase()}`}
                                    className="block text-sm hover:text-primary"
                                  >
                                    {brand}
                                  </Link>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
