"use client";

import { useEffect, useState } from "react";
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
import toast from "react-hot-toast";

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
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Prevent mobile keyboard on mount
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      // Blur any active input to prevent keyboard
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.tagName === "INPUT") {
        activeElement.blur();
      }

      // Prevent viewport zoom that can trigger keyboard
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const originalContent = viewport.getAttribute("content");
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        );

        // Restore original viewport on close
        return () => {
          if (originalContent) {
            viewport.setAttribute("content", originalContent);
          }
        };
      }
    }
  }, [isOpen]);

  // Fetch cart data only once when sidebar opens
  useEffect(() => {
    const fetchCart = async () => {
      if (!session?.user || !isOpen || hasInitialFetch) return;

      try {
        setLoading(true);
        const data = await getCart();
        setCart(data);
        setHasInitialFetch(true);

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
  }, [session?.user, isOpen, hasInitialFetch, onCartUpdate]);

  // Reset fetch flag when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setHasInitialFetch(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Listen for external cart updates (from other components)
  useEffect(() => {
    const handleExternalCartUpdate = () => {
      if (isOpen && session?.user) {
        // Refetch cart when updated from outside
        const fetchCart = async () => {
          try {
            const data = await getCart();
            setCart(data);
            const itemCount =
              data?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
            onCartUpdate?.(itemCount);
          } catch (error) {
            console.error("Failed to fetch cart:", error);
          }
        };
        fetchCart();
      }
    };

    window.addEventListener("cartUpdated", handleExternalCartUpdate);
    return () =>
      window.removeEventListener("cartUpdated", handleExternalCartUpdate);
  }, [isOpen, session?.user, onCartUpdate]);

  // Optimistic quantity update (no skeleton loading)
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || !cart) return;

    // Add to updating set for visual feedback
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    // Optimistic update - immediate UI change
    const optimisticCart = {
      ...cart,
      items: cart.items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    };

    // Recalculate total
    optimisticCart.totalAmount = optimisticCart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    setCart(optimisticCart);

    // Update navbar count immediately
    const itemCount = optimisticCart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    onCartUpdate?.(itemCount);

    try {
      // Background API call
      const updatedCart = await updateCartItem(itemId, newQuantity);

      // Sync with server response
      setCart(updatedCart);

      const serverItemCount = updatedCart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      onCartUpdate?.(serverItemCount);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update cart");

      // Revert on error
      setCart(cart);
      const revertedItemCount = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      onCartUpdate?.(revertedItemCount);
    } finally {
      // Remove from updating set
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Remove item with confirmation
  const handleRemoveItem = async (itemId: string, productTitle: string) => {
    if (!cart) return;

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Remove from cart?</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {productTitle}
          </p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                const originalCart = { ...cart };

                // Optimistic removal
                const optimisticCart = {
                  ...cart,
                  items: cart.items.filter((item) => item._id !== itemId),
                };

                optimisticCart.totalAmount = optimisticCart.items.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0,
                );

                setCart(optimisticCart);

                const itemCount = optimisticCart.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                onCartUpdate?.(itemCount);

                try {
                  const updatedCart = await removeCartItem(itemId);
                  setCart(updatedCart);

                  const serverItemCount = updatedCart.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );
                  onCartUpdate?.(serverItemCount);

                  toast.success("Item removed from cart");
                } catch (error) {
                  console.error("Failed to remove item:", error);
                  toast.error("Failed to remove item");

                  // Revert on error
                  setCart(originalCart);
                  const revertedItemCount = originalCart.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );
                  onCartUpdate?.(revertedItemCount);
                }
              }}
              className="rounded bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 },
    );
  };

  const handleProceed = () => {
    onClose();
    if (!session?.user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

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
      <SheetContent
        className="cart-sidebar flex w-full flex-col gap-0 p-0 sm:max-w-md"
        showCloseButton={false} // Disable auto-focus close button
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          // Additional focus prevention for mobile
          if (typeof window !== "undefined") {
            // Blur any active element to prevent keyboard
            const activeElement = document.activeElement as HTMLElement;
            if (activeElement && activeElement.blur) {
              activeElement.blur();
            }

            // Prevent any input from getting focus
            setTimeout(() => {
              const inputs = document.querySelectorAll(
                "input, textarea, select",
              );
              inputs.forEach((input) => {
                if (input instanceof HTMLElement) {
                  input.blur();
                }
              });
            }, 0);
          }
        }}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          // Prevent focus when clicking outside
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // Prevent focus when interacting outside
          const target = e.target as HTMLElement;
          if (target && target.tagName === "INPUT") {
            e.preventDefault();
          }
        }}
      >
        {/* Header */}
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span>My Cart</span>
              {totalItems > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onClose}
              onFocus={(e) => e.target.blur()} // Prevent focus
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col px-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b py-6">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                        <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                onFocus={(e) => e.target.blur()} // Prevent focus
              >
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
              <Button
                variant="outline"
                onClick={onClose}
                asChild
                onFocus={(e) => e.target.blur()} // Prevent focus
              >
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
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
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
                            disabled={
                              item.quantity <= 1 || updatingItems.has(item._id)
                            }
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            onFocus={(e) => e.target.blur()} // Prevent focus
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span
                            className={`w-8 text-center text-xs font-medium ${
                              updatingItems.has(item._id) ? "opacity-50" : ""
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            disabled={
                              item.quantity >= (item.productId?.stock || 0) ||
                              updatingItems.has(item._id)
                            }
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            onFocus={(e) => e.target.blur()} // Prevent focus
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            handleRemoveItem(
                              item._id,
                              item.productId?.title || "Product",
                            )
                          }
                          onFocus={(e) => e.target.blur()} // Prevent focus
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
              <Button
                className="w-full"
                size="lg"
                onClick={handleProceed}
                onFocus={(e) => e.target.blur()} // Prevent focus
              >
                {session?.user ? "Proceed to Checkout" : "Sign In to Checkout"}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={onClose}
                onFocus={(e) => e.target.blur()} // Prevent focus
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
