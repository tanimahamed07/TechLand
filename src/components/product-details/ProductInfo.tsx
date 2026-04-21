"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ShoppingCart,
  Share2,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Product } from "@/types/product.types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = React.useState(1);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        <Badge variant="secondary" className="mb-2">
          {product.brand}
        </Badge>
        <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted"
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-foreground">
            {product.rating.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          ({product.numReviews} reviews)
        </span>
        <span className="text-sm text-muted-foreground">
          • {product.sold} sold
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-primary">
          ৳{(product.discountPrice || product.price).toLocaleString()}
        </span>
        {product.discountPrice && (
          <span className="text-xl text-muted-foreground line-through">
            ৳{product.price.toLocaleString()}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {product.stock > 0 ? (
          <p className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">
              In Stock ({product.stock} available)
            </span>
          </p>
        ) : (
          <p className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            <span className="font-medium text-destructive">Out of Stock</span>
          </p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange("decrease")}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange("increase")}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button variant="outline" size="lg">
          <Heart className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Features */}
      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Free Shipping
              </p>
              <p className="text-xs text-muted-foreground">
                On orders over ৳5000
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Secure Payment
              </p>
              <p className="text-xs text-muted-foreground">100% secure</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Easy Returns
              </p>
              <p className="text-xs text-muted-foreground">7 days return</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
