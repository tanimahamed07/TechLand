"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { getCategoryTree } from "@/service/category.service";
import { CategoryTree } from "@/types/category.types";
import { getCart } from "@/service/cart.service";
import CartSidebar from "./CartSidebar";

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { data: session, status } = useSession();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryTree();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch cart count on mount and when user logs in
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!session?.user) {
        setCartCount(0);
        return;
      }

      try {
        const cart = await getCart();
        const count =
          cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();

    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [session]);

  // Wishlist count fetch
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!session?.user) {
        setWishlistCount(0);
        return;
      }
      try {
        const { getMyWishlist } = await import("@/service/wishlist.service");
        const result = await getMyWishlist();
        setWishlistCount(result.data?.length || 0);
      } catch {
        // silent fail
      }
    };

    fetchWishlistCount();

    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    return () =>
      window.removeEventListener("wishlistUpdated", fetchWishlistCount);
  }, [session]);

  const initials = useMemo(() => {
    const name = session?.user?.name ?? session?.user?.email ?? "User";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [session]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">TechLand</span>
          </Link>

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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/dashboard/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary p-0 text-xs text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full bg-muted" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1 transition hover:bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          session.user.image ?? "https://github.com/shadcn.png"
                        }
                        alt={session.user.name ?? "User avatar"}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">
                      {session.user.name ?? session.user.email}
                    </span>
                    <Menu className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[150px] p-1" align="end">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/my-orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/my-reviews">My Reviews</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  {/* Role based Admin Panel link */}
                  {(session.user.role === "admin" ||
                    session.user.role === "super-admin") && (
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer text-primary"
                    >
                      <Link
                        href="admin-panel"
                        className="flex items-center gap-2"
                      >
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={() => signOut()}
                    className="cursor-pointer text-destructive"
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

        <div className="border-t border-border">
          <div className="container mx-auto flex h-12 max-w-7xl items-center px-4">
            <nav className="hidden items-center gap-10 md:flex">
              <div className="flex items-center gap-5">
                <Link
                  href="/products"
                  className="text-sm font-bold hover:text-primary transition-colors"
                >
                  All Products
                </Link>

                {loading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  categories.map((category) => (
                    <React.Fragment key={category._id}>
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

                          {/* Dropdown দেখাবে যদি subcategories অথবা brands থাকে */}
                          {((category.children &&
                            category.children.length > 0) ||
                            (category.brands &&
                              category.brands.length > 0)) && (
                            <DropdownMenuContent
                              className="min-w-[400px] p-6"
                              align="start"
                              onMouseEnter={() => setOpenMenu(category.name)}
                            >
                              <div className="grid grid-cols-2 gap-8 divide-x divide-border">
                                {/* Subcategories Section */}
                                {category.children &&
                                  category.children.length > 0 && (
                                    <div className="pr-4">
                                      <h4 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                                        Categories
                                      </h4>
                                      <div className="space-y-2">
                                        {category.children.map((sub) => (
                                          <Link
                                            key={sub._id}
                                            href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                                            className="block text-sm hover:text-primary"
                                          >
                                            {sub.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Brands Section - category slug সহ link */}
                                {category.brands &&
                                  category.brands.length > 0 && (
                                    <div
                                      className={
                                        category.children &&
                                        category.children.length > 0
                                          ? "pl-4"
                                          : "col-span-2"
                                      }
                                    >
                                      <h4 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                                        Brands
                                      </h4>
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        {category.brands.map((brand) => (
                                          <Link
                                            key={brand}
                                            href={`/products?category=${category.slug}&brand=${brand.toLowerCase()}`}
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
                  ))
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCartUpdate={setCartCount}
      />
    </>
  );
}
