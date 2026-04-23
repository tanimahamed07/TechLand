"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getValidImageUrl } from "@/utils/imageUtils";

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
  const [selectedImage, setSelectedImage] = useState(0);

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
          src={getValidImageUrl([images[selectedImage]])}
          alt={title}
          width={600}
          height={600}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover w-full h-full"
          priority
          loading="eager"
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
                src={getValidImageUrl([image])}
                alt={`${title} - ${index + 1}`}
                width={150}
                height={150}
                sizes="(max-width: 1024px) 25vw, 12.5vw"
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
