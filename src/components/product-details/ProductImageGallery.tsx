"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  discount: number;
  isFeatured: boolean;
}

export function ProductImageGallery({
  images,
  title,
  discount,
  isFeatured,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
        {discount > 0 && (
          <Badge className="absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground">
            -{discount}% OFF
          </Badge>
        )}
        {isFeatured && (
          <Badge className="absolute right-4 top-4 z-10 bg-primary text-primary-foreground">
            FEATURED
          </Badge>
        )}
        <Image
          src={
            images[selectedImage] ||
            "https://placehold.co/600x600/e2e8f0/64748b?text=No+Image"
          }
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                selectedImage === index
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Image
                src={image}
                alt={`${title} - ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 25vw, 12.5vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
