"use client";

import React, { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Package,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";


const sidebarLinks = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/my-orders", label: "My Orders", icon: Package },
  { href: "/dashboard/my-reviews", label: "My Reviews", icon: MessageSquare },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;

  const initials = useMemo(() => {
    const name = user?.name ?? user?.email ?? "U";
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  useEffect(() => {
    if (status !== "loading" && !user) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [user, status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar — desktop */}
        <aside className="hidden w-52 shrink-0 flex-col gap-1 md:flex">
          {/* User info - session theke */}
          <div className="mb-2 flex items-center gap-3 px-3 py-4">
            <Avatar className="h-12 w-12 rounded-full border-2 border-primary">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {user.role}
              </p>
            </div>
          </div>

          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}

          {(user.role === "admin" || user.role === "super-admin") && (
            <Link
              href="/admin-panel"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                "text-primary hover:bg-primary/5",
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Admin Panel
            </Link>
          )}
        </aside>

        {/* Mobile tab strip */}
        <div className="scrollbar-none mb-1 flex gap-1 overflow-x-auto border-b border-border pb-3 md:hidden">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
