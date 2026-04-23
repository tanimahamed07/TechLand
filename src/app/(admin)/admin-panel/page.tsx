"use client";

import React, { useEffect, useState } from "react";
import { Package, Users, DollarSign, Star, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getDashboardOverview } from "@/service/dashboard.service";
import type { DashboardOverview } from "@/types/dashboard.types";

const statusColors: Record<string, string> = {
  pending: "#f59e0b", // amber-500
  processing: "#3b82f6", // blue-500
  shipped: "#8b5cf6", // violet-500
  delivered: "#10b981", // emerald-500
  cancelled: "#ef4444", // red-500
};

// Updated to support dark mode consistently
const badgeStyles: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  processing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  shipped:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400",
  delivered:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export default function OverviewPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const overview = await getDashboardOverview();
        setData(overview);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <OverviewSkeleton />;

  const statCards = [
    {
      label: "Total Revenue",
      value: `৳${(data?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders || 0,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Products",
      value: data?.totalProducts || 0,
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Total Users",
      value: data?.totalUsers || 0,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const orderStatusData = Object.entries(data?.orderStatusMap || {}).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      fill: statusColors[name.toLowerCase()] || "#8884d8",
    }),
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your store&apos;s performance
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-xl border border-border bg-card shadow-sm"
          >
            <CardContent className="p-6 flex flex-col gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 1: Line Chart (Revenue) & Donut Chart (Status) */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
        {/* Monthly Revenue */}
        <Card className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">
              Monthly Revenue
            </CardTitle>
            <CardDescription className="text-sm">
              Last 12 months (excl. cancelled orders)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data?.monthlyData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="opacity-10"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  tickFormatter={(val) => `৳${val / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                  }}
                  formatter={(val: number) => [
                    `৳${val.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "var(--background)",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card className="lg:col-span-1 rounded-xl border border-border bg-card shadow-sm relative">
          <CardHeader>
            <CardTitle className="text-base font-bold">
              Orders by Status
            </CardTitle>
            <CardDescription className="text-sm">
              All-time distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">
                {data?.totalOrders || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Bar Chart (Orders) & Top Products */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
        {/* Monthly Orders */}
        <Card className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">
              Monthly Orders
            </CardTitle>
            <CardDescription className="text-sm">
              Last 12 months (excl. cancelled)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.monthlyData}
                margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="opacity-10"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  cursor={{ fill: "currentColor", opacity: 0.05 }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-1 rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">
                Top Products
              </CardTitle>
              <CardDescription className="text-sm">
                By units sold
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            {data?.topProducts.slice(0, 5).map((product, idx) => (
              <div key={product._id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-3 font-medium">
                  {idx + 1}
                </span>
                <div className="h-10 w-10 rounded-md bg-muted flex-shrink-0 overflow-hidden border border-border">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-full w-full p-2 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {product.title}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                    <span>{product.rating || "4.5"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold">
                    {product.sold} sold
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Recent Orders Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Recent Orders</h2>
        <div className="overflow-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Order #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {(order.userId?.name || "G").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">
                        {order.userId?.name || "Guest User"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ৳{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
                      {order.paymentMethod || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase ${badgeStyles[order.orderStatus?.toLowerCase()] || badgeStyles.pending}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[120px] rounded-xl border border-border bg-card"
          />
        ))}
      </div>
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
        <div className="h-[400px] lg:col-span-2 rounded-xl border border-border bg-card" />
        <div className="h-[400px] lg:col-span-1 rounded-xl border border-border bg-card" />
      </div>
    </div>
  );
}
