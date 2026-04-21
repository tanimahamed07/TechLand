"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ICart } from "@/types/cart.types";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "@/service/cart.service";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate?: (itemCount: number) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  onCartUpdate,
}: CartSidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(false);

  // Cart fetch করা
  useEffect(() => {
    const fetchCart = async () => {
      if (!session?.user || !isOpen) return;

      try {
        setLoading(true);
        const data = await getCart();
        setCart(data);

        // Update cart count in Navbar
        const itemCount =
          data?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
        onCartUpdate?.(itemCount);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [session, isOpen, onCartUpdate]);

  // Quantity update করা
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const updatedCart = await updateCartItem(itemId, newQuantity);
      setCart(updatedCart);

      // Update cart count
      const itemCount = updatedCart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      onCartUpdate?.(itemCount);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  // Item remove করা
  const handleRemoveItem = async (itemId: string) => {
    try {
      const updatedCart = await removeCartItem(itemId);
      setCart(updatedCart);

      // Update cart count
      const itemCount = updatedCart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      onCartUpdate?.(itemCount);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Checkout এ যাওয়া
  const handleProceed = () => {
    onClose();
    if (!session?.user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const totalItems =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {/* Header */}
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span>My Cart</span>
            {totalItems > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : !session?.user ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">Please login</p>
                <p className="text-sm text-muted-foreground">
                  Sign in to view your cart
                </p>
              </div>
              <Button variant="outline" onClick={() => router.push("/login")}>
                Sign In
              </Button>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Looks like you haven&apos;t added anything yet.
                </p>
              </div>
              <Button variant="outline" onClick={onClose} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col px-6">
              {cart.items.map((item) => (
                <div key={item._id} className="border-b py-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      href={`/products/${item.productId?._id || ""}`}
                      onClick={onClose}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted"
                    >
                      <Image
                        src={
                          item.productId?.images?.[0] ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"
                        }
                        alt={item.productId?.title || "Product"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-1">
                        <Link
                          href={`/products/${item.productId?._id || ""}`}
                          onClick={onClose}
                          className="line-clamp-1 text-sm font-medium leading-none transition-colors hover:text-primary"
                        >
                          {item.productId?.title || "Product"}
                        </Link>
                        {item.productId?.brand && (
                          <p className="text-xs uppercase tracking-tight text-muted-foreground">
                            {item.productId.brand}
                          </p>
                        )}
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                handleRemoveItem(item._id);
                              } else {
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity - 1,
                                );
                              }
                            }}
                          >
                            {item.quantity <= 1 ? (
                              <Trash2 className="h-3 w-3 text-destructive" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </Button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            disabled={
                              item.quantity >= (item.productId?.stock || 0)
                            }
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="flex flex-col gap-4 border-t p-6">
            <div className="flex items-center justify-between text-base font-medium">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex flex-col gap-2">
              <Button className="w-full" size="lg" onClick={handleProceed}>
                {session?.user ? "Proceed to Checkout" : "Sign In to Checkout"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
