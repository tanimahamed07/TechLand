"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  stock: number;
}

export function AddToCartButton({
  productId,
  productName,
  stock,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (quantity > stock) {
      alert("Quantity exceeds available stock");
      return;
    }

    try {
      setIsAdding(true);
      // TODO: Add to cart API call
      console.log(`Added ${quantity} of ${productName} to cart`);
      alert(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="px-3 py-2 hover:bg-muted disabled:opacity-50"
          >
            −
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
            className="px-3 py-2 hover:bg-muted disabled:opacity-50"
          >
            +
          </button>
        </div>
        <span className="text-sm text-muted-foreground">{stock} available</span>
      </div>

      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleAddToCart}
        disabled={stock === 0 || isAdding}
      >
        <ShoppingCart className="h-5 w-5" />
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}
