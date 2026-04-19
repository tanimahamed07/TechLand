"use client";

import * as React from "react"; // React import করুন স্টেট ম্যানেজমেন্টের জন্য
import Link from "next/link";
import { Search, Heart, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut, useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  const initials = React.useMemo(() => {
    const name = session?.user?.name ?? session?.user?.email ?? "User";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [session]);

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

          {status === "loading" ? (
            <div className="h-10 w-10 rounded-full bg-muted" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1 transition hover:bg-muted">
                  <Avatar>
                    <AvatarImage
                      src={
                        session.user.image ?? "https://github.com/shadcn.png"
                      }
                      alt={session.user.name ?? "User avatar"}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                    <AvatarBadge className="bg-green-400 dark:bg-green-800" />
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">
                    {session.user.name ?? session.user.email}
                  </span>
                  <Menu className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[150px] p-1" align="end">
                <DropdownMenuItem
                  onSelect={() => signOut()}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-border">
        <div className="container mx-auto flex h-12 max-w-7xl items-center px-4">
          <nav className="hidden items-center gap-10 md:flex">
            {" "}
            {/* gap বাড়িয়ে 10 করা হয়েছে */}
            <div className="flex items-center gap-5">
              {" "}
              {/* মেনু আইটেমগুলোকে আলাদা র‍্যাপার এ রাখা হয়েছে */}
              <Link
                href="/products"
                className="text-sm font-bold hover:text-primary transition-colors"
              >
                All Products
              </Link>
              {categories.map((category) => (
                <React.Fragment key={category.name}>
                  {/* Vertical Line - প্রতিটি আইটেমের আগে একটি হালকা লাইন */}
                  <div className="h-4 w-[2px] bg-border/70" />

                  <div
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
                          onMouseEnter={() => setOpenMenu(category.name)}
                        >
                          {/* ... (বাকি কন্টেন্ট আগের মতোই থাকবে) ... */}
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
                            {/* Brands section */}
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
                </React.Fragment>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
