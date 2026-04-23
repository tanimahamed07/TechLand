"use client";

import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatPrice";
import {
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrackingData {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryCharge?: number;
  orderNote?: string;
  items: { title: string; quantity: number; image?: string; price: number }[];
  createdAt: string;
  updatedAt: string;
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    icon: Clock,
    description: "Your order has been received",
  },
  {
    key: "processing",
    label: "Processing",
    icon: Package,
    description: "We're preparing your items",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
    description: "Your order is on the way",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: PackageCheck,
    description: "Package delivered successfully",
  },
];

const STATUS_ORDER: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

// ─── Timeline events derived from status ─────────────────────────────────────

function buildTimeline(status: string, createdAt: string, updatedAt: string) {
  const idx = STATUS_ORDER[status] ?? -1;
  const events: {
    label: string;
    sub: string;
    date: string;
    active: boolean;
  }[] = [];

  const fmt = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (idx >= 0)
    events.push({
      label: "Order Placed",
      sub: "Your order was received and confirmed.",
      date: fmt(createdAt),
      active: true,
    });
  if (idx >= 1)
    events.push({
      label: "Processing",
      sub: "Seller is preparing your package.",
      date: fmt(updatedAt),
      active: true,
    });
  if (idx >= 2)
    events.push({
      label: "Shipped",
      sub: "Package handed to delivery partner.",
      date: fmt(updatedAt),
      active: true,
    });
  if (idx >= 3)
    events.push({
      label: "Delivered",
      sub: "Package delivered successfully.",
      date: fmt(updatedAt),
      active: true,
    });

  return events.reverse(); // newest first
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderTracker({ data }: { data: TrackingData }) {
  const isCancelled = data.orderStatus === "cancelled";
  const currentStep = STATUS_ORDER[data.orderStatus] ?? 0;
  const timeline = buildTimeline(
    data.orderStatus,
    data.createdAt,
    data.updatedAt,
  );

  const paymentBadge =
    data.paymentStatus === "paid"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : data.paymentStatus === "failed"
        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Order Number
            </p>
            <p className="font-black text-lg font-mono text-primary">
              {data.orderNumber}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on{" "}
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {isCancelled ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                <XCircle className="w-3 h-3" /> Cancelled
              </span>
            ) : (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                  data.orderStatus === "delivered"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : data.orderStatus === "shipped"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                      : data.orderStatus === "processing"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}
              >
                {data.orderStatus}
              </span>
            )}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${paymentBadge}`}
            >
              Payment: {data.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* ── Progress Stepper ────────────────────────────────────────────── */}
      {!isCancelled && (
        <div className="rounded-lg border border-border bg-card shadow-sm p-5 sm:p-6">
          <div className="flex items-start justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0 mx-[10%]" />

            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              const Icon = step.icon;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-2 z-10 flex-1"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      done && !active
                        ? "bg-primary border-primary text-primary-foreground"
                        : active
                          ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-background border-border text-muted-foreground",
                    )}
                  >
                    {done && !active ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        done ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground hidden sm:block mt-0.5 max-w-[80px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Timeline ───────────────────────────────────────────────────── */}
      {timeline.length > 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4">Tracking Timeline</h3>
          <ul className="space-y-0">
            {timeline.map((event, i) => (
              <li key={i} className="flex gap-4">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full shrink-0 mt-1",
                      i === 0
                        ? "bg-primary ring-4 ring-primary/20"
                        : "bg-muted",
                    )}
                  />
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border my-1 min-h-[24px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      i === 0 ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {event.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.sub}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {event.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Order Items ─────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-card shadow-sm p-5">
        <h3 className="font-bold text-sm mb-4">Items Ordered</h3>
        <ul className="divide-y divide-border">
          {data.items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                <Image
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=60"
                  }
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        {/* Price summary */}
        <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm">
          {(data.deliveryCharge ?? 0) > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>${data.deliveryCharge}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="text-primary">
              {formatPrice(data.totalAmount)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            Payment: {data.paymentStatus}
          </p>
        </div>

        {data.orderNote && (
          <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Note: </span>
            {data.orderNote}
          </div>
        )}
      </div>
    </div>
  );
}
