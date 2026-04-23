"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Tag,
  LogOut,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Menu,
  Store,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/utils/cn";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navLinks = [
  {
    href: "/admin-panel",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin-panel/products",
    label: "Products",
    icon: Package,
    children: [
      { href: "/admin-panel/products", label: "All Products" },
      { href: "/admin-panel/products/add", label: "Add Product" },
    ],
  },
  { href: "/admin-panel/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin-panel/users", label: "Users", icon: Users },
  { href: "/admin-panel/reviews", label: "Reviews", icon: Star },
  { href: "/admin-panel/categories", label: "Categories", icon: Tag },
  {
    href: "/admin-panel/ai-tools",
    label: "AI Tools",
    icon: Sparkles,
    children: [
      {
        href: "/admin-panel/ai-tools/description",
        label: "Generator Description",
      },
      { href: "/admin-panel/ai-tools/tags", label: "Generate Tags" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = session?.user;

  const initials = useMemo(() => {
    const name = user?.name ?? user?.email ?? "A";
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  // Dropdown persistence logic
  useEffect(() => {
    navLinks.forEach((link) => {
      if (
        link.children?.some(
          (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
        )
      ) {
        setOpenMenus((prev) =>
          prev.includes(link.href) ? prev : [...prev, link.href],
        );
      }
    });
  }, [pathname]);

  // Auth protection
  useEffect(() => {
    if (status === "loading") return;
    if (!user || (user.role !== "admin" && user.role !== "super-admin")) {
      router.replace("/");
    }
  }, [user, status, router]);

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    );
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "super-admin"))
    return null;

  // Sidebar reusable component
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            TechLand
          </span>
        </Link>
        <Badge
          variant="secondary"
          className="ml-auto text-[10px] font-bold uppercase tracking-wider"
        >
          Admin
        </Badge>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-hide">
        {navLinks.map(({ href, label, icon: Icon, exact, children }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);
          const isOpen = openMenus.includes(href);

          return (
            <div key={href} className="mb-1">
              {children ? (
                <>
                  <button
                    onClick={() => toggleMenu(href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "block rounded-md px-3 py-2 text-xs font-medium transition-colors",
                            pathname === child.href
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t bg-muted/20 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-background border border-border/50 p-2 shadow-sm">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? "Admin"} />
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-bold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-[10px] font-medium text-muted-foreground capitalize">
              {user.role}
            </p>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 rounded-lg text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-xs font-bold">Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background/50">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-muted"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0">
                {/* --- FIX: Added SR Header to resolve Accessibility Error --- */}
                <div className="sr-only">
                  <SheetHeader>
                    <SheetTitle>Admin Navigation</SheetTitle>
                    <SheetDescription>
                      Main navigation links for admin panel
                    </SheetDescription>
                  </SheetHeader>
                </div>
                {/* ---------------------------------------------------------- */}

                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Link
                href="/admin-panel"
                className="hover:text-primary transition-colors"
              >
                Admin
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-semibold capitalize">
                {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-xs font-bold"
              asChild
            >
              <Link href="/">
                <Store className="h-3.5 w-3.5" />
                View Store
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden" asChild>
              <Link href="/">
                <Store className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
