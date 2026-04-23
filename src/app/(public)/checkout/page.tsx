"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Lock, MapPin, ShoppingBag, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { getCart } from "@/service/cart.service";
import { createCheckoutSession } from "@/service/payment.service";
import { ICart } from "@/types/cart.types";

// Hardcoded delivery zones
const DELIVERY_ZONES = [
  {
    id: "inside-dhaka",
    name: "Inside Dhaka",
    charge: 100,
    estimatedDays: "1-2 days",
  },
  {
    id: "outside-dhaka",
    name: "Outside Dhaka",
    charge: 250,
    estimatedDays: "3-5 days",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // Form states
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      // Wait for session to load
      if (status === "loading") return;

      if (!session?.user) {
        router.push("/login?redirect=/checkout");
        return;
      }

      try {
        const cartData = await getCart();

        if (!cartData || cartData.items.length === 0) {
          router.push("/products");
          return;
        }

        setCart(cartData);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Phone number is required");
      return;
    }

    if (!selectedZoneId) {
      toast.error("Please select a delivery zone");
      return;
    }

    try {
      setPlacing(true);
      const result = await createCheckoutSession({
        shippingAddress: {
          street,
          city,
          country,
          zip,
        },
        phone,
        orderNote,
        deliveryZoneId: selectedZoneId,
      });

      // Redirect to Stripe checkout
      if (result.data.url) {
        window.location.href = result.data.url;
      }
    } catch (error: unknown) {
      console.error("Checkout failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create checkout session",
      );
    } finally {
      setPlacing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-14 w-14 text-muted-foreground/20" />
        <p className="font-medium text-muted-foreground">Your cart is empty</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate delivery charge based on selected zone
  const selectedZone = DELIVERY_ZONES.find(
    (zone) => zone.id === selectedZoneId,
  );
  const deliveryCharge = selectedZone ? selectedZone.charge : 0;
  const grandTotal = cart.totalAmount + deliveryCharge;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="transition-colors hover:text-primary">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="mb-8 text-2xl font-bold text-foreground">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-bold">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House 12, Road 5"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Dhaka"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Bangladesh"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="1000"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Phone Number <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Zone Selection */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="font-bold">
                  Delivery Zone <span className="text-destructive">*</span>
                </h2>
              </div>
              <div className="space-y-3">
                {DELIVERY_ZONES.map((zone) => (
                  <label
                    key={zone.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                      selectedZoneId === zone.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryZone"
                        value={zone.id}
                        checked={selectedZoneId === zone.id}
                        onChange={(e) => setSelectedZoneId(e.target.value)}
                        className="radio radio-primary radio-sm"
                      />
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Estimated: {zone.estimatedDays}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-primary">৳{zone.charge}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Note */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-3 font-bold">
                Order Note{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (optional)
                </span>
              </h2>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                rows={3}
                placeholder="Special instructions..."
                className="textarea textarea-bordered w-full resize-none text-sm"
                maxLength={300}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your information is encrypted and secure</span>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="sticky top-28 rounded-lg border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 font-bold">
                Order Summary
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </h2>

              <ul className="mb-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <li key={item._id} className="flex items-start gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={
                          item.productId?.images?.[0] ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"
                        }
                        alt={item.productId?.title || "Product"}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">
                        {item.productId?.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="divider my-0" />

              <div className="my-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span
                    className={
                      deliveryCharge > 0
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {deliveryCharge > 0 ? `৳${deliveryCharge}` : "Select zone"}
                  </span>
                </div>
              </div>

              <div className="divider my-0" />

              <div className="mb-4 flex justify-between text-base font-bold">
                <span>Grand Total</span>
                <span className="text-lg text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <Button
                type="submit"
                disabled={placing}
                className="w-full gap-2"
                size="lg"
              >
                {placing ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
