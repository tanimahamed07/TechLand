"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Package,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { confirmToast } from "@/utils/confirmToast";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllOrders, cancelOrder } from "@/service/order.service";
import { IOrder } from "@/types/order.types";
import OrderTracker from "@/components/order/OrderTracker";

const statusVariants: Record<
  string,
  "outline" | "default" | "secondary" | "destructive"
> = {
  pending: "outline",
  processing: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

function OrderCard({
  order,
  onRefresh,
}: {
  order: IOrder;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    const confirmed = await confirmToast("Cancel this order?");
    if (!confirmed) return;
    try {
      setCancelling(true);
      await cancelOrder(order._id);
      toast.success("Order cancelled successfully");
      onRefresh();
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-bold text-primary tracking-tight">
                #{order.orderNumber.slice(-8).toUpperCase()}
              </p>
              <Badge
                variant={statusVariants[order.orderStatus] || "outline"}
                className="capitalize px-2 py-0 h-4 text-[10px]"
              >
                {order.orderStatus}
              </Badge>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" • "}
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </p>
          </div>
          <span className="font-bold text-sm">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="mt-3 space-y-1">
          {order.items.slice(0, 2).map((item, i) => (
            <p
              key={i}
              className="text-xs text-muted-foreground line-clamp-1 italic"
            >
              {item.title}{" "}
              <span className="not-italic opacity-60">×{item.quantity}</span>
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
              + {order.items.length - 2} more items
            </p>
          )}
        </div>

        <Separator className="my-3 opacity-50" />

        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {expanded ? "Hide Tracking" : "Track Order"}
          </button>

          <div className="flex items-center gap-3">
            {order.paymentStatus === "pending" &&
              order.orderStatus !== "cancelled" && (
                <Link
                  href="/checkout"
                  className="text-xs font-semibold text-primary border border-primary rounded px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Pay Now
                </Link>
              )}
            {order.orderStatus === "pending" && (
              <button
                disabled={cancelling}
                onClick={handleCancel}
                className="text-xs text-destructive hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {cancelling ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <X className="w-3 h-3" />
                )}
                Cancel
              </button>
            )}
          </div>
        </div>
      </CardContent>

      {expanded && (
        <div className="bg-muted/20 border-t p-4">
          <OrderTracker
            data={{
              ...order,
              items: order.items.map((item) => ({
                ...item,
                image: item.image || "",
              })),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!session?.user) return;
    try {
      setRefreshing(true);
      const result = await getAllOrders(1, 50);
      setOrders(result.data || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return;
      try {
        const result = await getAllOrders(1, 50);
        setOrders(result.data || []);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button
          onClick={fetchOrders}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <Package className="w-16 h-16 text-muted-foreground/20" />
          <div>
            <p className="font-semibold text-lg mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </p>
          </div>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onRefresh={fetchOrders} />
          ))}
        </div>
      )}
    </div>
  );
}
