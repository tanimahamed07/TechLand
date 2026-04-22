"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/utils/cn";

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

  const user = session?.user;

  const initials = React.useMemo(() => {
    const name = user?.name ?? user?.email ?? "A";
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  // Auto-open parent if child is active
  useEffect(() => {
    navLinks.forEach((link) => {
      if (link.children?.some((c) => pathname.startsWith(c.href))) {
        setOpenMenus((prev) =>
          prev.includes(link.href) ? prev : [...prev, link.href],
        );
      }
    });
  }, [pathname]);

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
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "super-admin"))
    return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                T
              </span>
            </div>
            <span className="font-bold text-foreground">TechLand</span>
          </Link>
          <Badge variant="outline" className="ml-auto text-[10px] uppercase">
            Admin
          </Badge>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navLinks.map(({ href, label, icon: Icon, exact, children }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
            const isOpen = openMenus.includes(href);

            if (children) {
              return (
                <div key={href}>
                  {/* Parent button */}
                  <button
                    onClick={() => toggleMenu(href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                    {isOpen ? (
                      <ChevronDown className="ml-auto h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="ml-auto h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Submenu */}
                  {isOpen && (
                    <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-primary/20 pl-3">
                      {children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "relative flex items-center rounded-md px-3 py-2 text-sm transition-all duration-150",
                              isChildActive
                                ? "bg-primary/10 font-semibold text-primary before:absolute before:left-[-13px] before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary before:content-['']"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="space-y-2 border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "Admin"} />
              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{user.name}</p>
              <p className="truncate text-[10px] capitalize text-muted-foreground">
                {user.role}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
          <div>
            <h1 className="text-sm font-semibold capitalize text-foreground">
              {navLinks.find(
                (l) => pathname.startsWith(l.href) && l.href !== "/admin-panel",
              )?.label || "Overview"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {pathname.replace("/admin-panel", "").replace("/", " / ") ||
                "Dashboard"}
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            ← Back to Store
          </Link>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
