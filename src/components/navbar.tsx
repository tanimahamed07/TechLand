"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Package,
  Star,
  Shield,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryTree();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch cart count
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

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [session]);

  // Fetch wishlist count
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
        /* silent fail */
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
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [session]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">TechLand</span>
          </Link>

          {/* Desktop Search */}
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

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/dashboard/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white flex items-center justify-center">
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
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary p-0 text-xs text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
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

                  {/* Role based Admin Panel link */}

                  {(session.user.role === "admin" ||
                    session.user.role === "super-admin") && (
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer text-primary"
                    >
                      <Link
                        href="/admin-panel"
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
                <Button size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile-only Icons & Hamburger (Extreme Right) */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              asChild
            >
              <Link href="/dashboard/wishlist">
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 p-0 text-[10px] text-white flex items-center justify-center">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary p-0 text-[10px] text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Hamburger Menu - Fixed position at the end */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 ml-1"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden border-t border-border md:block">
          <div className="container mx-auto flex h-12 max-w-7xl items-center px-4">
            <nav className="flex items-center gap-8">
              <Link
                href="/products"
                className="text-sm font-bold hover:text-primary transition-colors"
              >
                All Products
              </Link>
              {!loading &&
                categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center gap-8"
                    onMouseEnter={() => setOpenMenu(category.name)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <div className="h-4 w-[1px] bg-border" />
                    <DropdownMenu open={openMenu === category.name}>
                      <DropdownMenuTrigger className="text-sm font-bold hover:text-primary outline-none">
                        {category.name}
                      </DropdownMenuTrigger>
                      {((category.children?.length ?? 0) > 0 ||
                        (category.brands?.length ?? 0) > 0) && (
                        <DropdownMenuContent
                          className="min-w-[450px] p-6"
                          align="start"
                        >
                          <div className="grid grid-cols-2 gap-8 divide-x">
                            {category.children &&
                              category.children.length > 0 && (
                                <div>
                                  <h4 className="mb-3 text-xs font-bold uppercase text-muted-foreground">
                                    Categories
                                  </h4>
                                  <div className="space-y-2 flex flex-col">
                                    {category.children.map((sub) => (
                                      <Link
                                        key={sub._id}
                                        href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                                        className="text-sm hover:text-primary"
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            {category.brands && category.brands.length > 0 && (
                              <div className="pl-6">
                                <h4 className="mb-3 text-xs font-bold uppercase text-muted-foreground">
                                  Brands
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {category.brands.map((brand) => (
                                    <Link
                                      key={brand}
                                      href={`/products?category=${category.slug}&brand=${brand.toLowerCase()}`}
                                      className="text-sm hover:text-primary"
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

      {/* Mobile Drawer (Left side) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[300px] p-0 flex flex-col h-full"
        >
          <SheetHeader className="border-b p-4 shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                T
              </div>
              TechLand
            </SheetTitle>
          </SheetHeader>

          <div className="p-4 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 h-9" />
            </div>
          </div>

          {/* Main Content Area - Category Section */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase text-muted-foreground mb-2">
                Shop Categories
              </p>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Package className="h-4 w-4" /> All Products
              </Link>
              {categories.map((category) => (
                <Collapsible
                  key={category._id}
                  open={expandedCat === category._id}
                  onOpenChange={(v) => setExpandedCat(v ? category._id : null)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-muted">
                      {category.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedCat === category._id ? "rotate-180" : ""}`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1 mt-1">
                    {category.children?.map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </nav>
          </div>

          {/* Account Settings Section - Pushed to Bottom */}
          <div className="mt-auto border-t bg-muted/10">
            {session?.user ? (
              <nav className="px-2 py-4 space-y-1">
                <p className="px-3 text-[11px] font-bold uppercase text-muted-foreground mb-2">
                  Account Settings
                </p>
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link
                    href="/dashboard/my-orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                  >
                    <Package className="h-4 w-4" /> My Orders
                  </Link>

                  {(session.user.role === "admin" ||
                    session.user.role === "super-admin") && (
                    <Link
                      href="/admin-panel"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-primary rounded-md hover:bg-muted transition-colors"
                    >
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive rounded-md hover:bg-muted transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </nav>
            ) : (
              /* Non-Logged In Footer */
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCartUpdate={setCartCount}
      />
    </>
  );
}
