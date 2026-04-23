"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyPayment } from "@/service/payment.service";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setError("Invalid session");
        setLoading(false);
        return;
      }

      try {
        const result = await verifyPayment(sessionId);
        setOrderId(result.data.orderId);
      } catch (err) {
        console.error("Payment verification failed:", err);
        setError("Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <Package className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Payment Verification Failed</h1>
        <p className="text-center text-muted-foreground">{error}</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
          <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
        </div>
      </div>

      <h1 className="mb-3 text-3xl font-bold text-foreground">
        Order Placed Successfully!
      </h1>

      <p className="mb-2 text-lg text-muted-foreground">
        Thank you for your purchase
      </p>

      {orderId && (
        <p className="mb-8 text-sm text-muted-foreground">
          Order ID: <span className="font-mono font-medium">{orderId}</span>
        </p>
      )}

      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-4 text-left">
          <Package className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="mb-1 font-semibold">What's Next?</h3>
            <p className="text-sm text-muted-foreground">
              We've received your order and will start processing it shortly.
              You'll receive an email confirmation with tracking details once
              your order ships.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/dashboard/my-orders">
          <Button size="lg" className="w-full gap-2 sm:w-auto">
            View My Orders
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
