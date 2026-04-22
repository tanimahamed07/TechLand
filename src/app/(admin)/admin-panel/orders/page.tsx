"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { getAllOrders, updateOrderStatus } from "@/service/order.service";
import { IOrder, OrderStatus, PaymentStatus } from "@/types/order.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed"];

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const orderStatusVariant: Record<OrderStatus, string> = {
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

const paymentStatusVariant: Record<PaymentStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

function getUser(order: IOrder) {
  if (order.userId && typeof order.userId === "object") return order.userId;
  return null;
}

// ─── Order Details Modal ──────────────────────────────────────────────────────

function OrderModal({
  order,
  onClose,
  onUpdated,
}: {
  order: IOrder;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const user = getUser(order);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    order.orderStatus,
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (orderStatus === order.orderStatus) {
      onClose();
      return;
    }
    try {
      setSaving(true);
      await updateOrderStatus(order._id, orderStatus);
      toast.success("Order status updated");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-mono text-lg font-bold text-primary">
              {order.orderNumber}
            </h2>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </p>
              {user ? (
                <>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Unknown</p>
              )}
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Shipping
              </p>
              {order.shippingAddress ? (
                <div className="space-y-0.5 text-sm">
                  {order.shippingAddress.street && (
                    <p>{order.shippingAddress.street}</p>
                  )}
                  {order.shippingAddress.city && (
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.zip}
                    </p>
                  )}
                  {order.shippingAddress.country && (
                    <p>{order.shippingAddress.country}</p>
                  )}
                  {order.phone && (
                    <p className="mt-1 font-medium">📞 {order.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-8 w-8 rounded object-cover"
                          />
                        )}
                        <span className="line-clamp-1">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      ৳{item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border p-4 space-y-1.5 text-sm">
            {(order.deliveryCharge ?? 0) > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>৳{order.deliveryCharge}</span>
              </div>
            )}
            {(order.couponDiscount ?? 0) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-৳{order.couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-1.5 font-bold">
              <span>Total</span>
              <span className="text-primary">
                ৳{order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">Payment:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${paymentStatusVariant[order.paymentStatus]}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {order.orderNote && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="font-medium">Note: </span>
              {order.orderNote}
            </div>
          )}

          {/* Update Status */}
          <div className="rounded-lg border border-border p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Update Order Status
            </p>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            className="flex-1"
            disabled={saving || orderStatus === order.orderStatus}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const fetchOrders = async (p = page, status = statusFilter) => {
    try {
      setLoading(true);
      const result = await getAllOrders(p, 15, status || undefined);
      setOrders(result.data || []);
      setTotalPages(result.meta?.totalPages || 1);
      setTotal(result.meta?.total || 0);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getAllOrders(page, 15, statusFilter || undefined);
        setOrders(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
        setTotal(result.meta?.total || 0);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, statusFilter]);

  // Client-side search
  const filtered = search.trim()
    ? orders.filter((o) => {
        const q = search.toLowerCase();
        const user = getUser(o);
        return (
          o.orderNumber?.toLowerCase().includes(q) ||
          user?.name?.toLowerCase().includes(q) ||
          user?.email?.toLowerCase().includes(q)
        );
      })
    : orders;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{total} orders total</p>
        </div>
        <input
          type="text"
          placeholder="Search order # or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:w-72"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
              setSearch("");
            }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Order #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Items
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Payment
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    {search
                      ? `No orders match "${search}"`
                      : "No orders found."}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const user = getUser(order);
                  return (
                    <tr
                      key={order._id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        {user ? (
                          <div>
                            <p className="max-w-[140px] truncate text-sm font-medium">
                              {user.name}
                            </p>
                            <p className="max-w-[140px] truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {order.items.length}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ৳{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${paymentStatusVariant[order.paymentStatus]}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${orderStatusVariant[order.orderStatus]}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={() => fetchOrders()}
        />
      )}
    </div>
  );
}
