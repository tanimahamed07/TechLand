"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, RefreshCw, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllOrders, cancelOrder } from "@/service/order.service";
import { IOrder } from "@/types/order.types";
import OrderTracker from "@/components/order/OrderTracker";

const statusColors: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  processing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  shipped:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
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
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelling(true);
      await cancelOrder(order._id);
      alert("Order cancelled successfully");
      onRefresh();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert(error instanceof Error ? error.message : "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      {/* Summary row */}
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-bold text-sm font-mono text-primary">
              {order.orderNumber}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                statusColors[order.orderStatus] ??
                "bg-muted text-muted-foreground"
              }`}
            >
              {order.orderStatus}
            </span>
            <span className="font-bold text-primary text-sm">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Item preview */}
        <div className="mt-3 space-y-1">
          {order.items.slice(0, 2).map((item, i) => (
            <p key={i} className="text-xs text-muted-foreground line-clamp-1">
              {item.title} × {item.quantity}
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-muted-foreground/60">
              +{order.items.length - 2} more
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Hide Tracking
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Track Order
              </>
            )}
          </button>
          {order.orderStatus === "pending" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="ml-auto text-xs text-destructive hover:underline flex items-center gap-1"
            >
              {cancelling ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  Cancel Order
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable tracking panel */}
      {expanded && (
        <div className="border-t border-border bg-muted/30 p-4">
          <OrderTracker
            data={{
              orderNumber: order.orderNumber,
              orderStatus: order.orderStatus,
              paymentStatus: order.paymentStatus,
              totalAmount: order.totalAmount,
              deliveryCharge: order.deliveryCharge,
              orderNote: order.orderNote,
              items: order.items.map((item) => ({
                title: item.title,
                quantity: item.quantity,
                image: item.image,
                price: item.price,
              })),
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
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
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
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

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <Package className="w-16 h-16 text-muted-foreground/20" />
          <div>
            <p className="font-semibold text-lg mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground">
              Start shopping to see your orders here
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
