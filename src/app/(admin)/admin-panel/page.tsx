"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminGetAllProducts } from "@/service/admin.product.service";
import { getAllOrders } from "@/service/order.service";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          adminGetAllProducts({ limit: 1 }),
          getAllOrders(1, 1),
        ]);

        const totalRevenue = 0; // orders theke calculate korte hobe

        setStats({
          totalProducts: productsRes.meta?.total || 0,
          totalOrders: ordersRes.meta?.total || 0,
          totalRevenue,
        });
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Total Users",
      value: "-",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Total Revenue",
      value: "-",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back — here&apos;s what&apos;s happening with your store
          today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, color, bg }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-20 animate-pulse rounded bg-muted" />
              ) : (
                <p className="text-3xl font-bold">{value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
