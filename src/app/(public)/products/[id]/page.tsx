"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getProductById, getAllProducts } from "@/service/product.service";
import { Product } from "@/types/product.types";
import { ProductImageGallery } from "@/components/product-details/ProductImageGallery";
import { ProductInfo } from "@/components/product-details/ProductInfo";
import { ProductTabs } from "@/components/product-details/ProductTabs";
import { RelatedProducts } from "@/components/product-details/RelatedProducts";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = React.useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Product fetch করা
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);

        // Related products fetch করা (same category)
        if (data.category?._id) {
          const relatedData = await getAllProducts({
            limit: 20, // আরো বেশি products fetch করা
          });
          // Filter করে same category এর products নেওয়া (current product বাদে)
          const filtered = relatedData.data.filter(
            (p) => p.category._id === data.category._id && p._id !== data._id,
          );
          setRelatedProducts(filtered.slice(0, 4));
          console.log("Related products found:", filtered.length);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-4 w-64 rounded bg-muted" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded bg-muted" />
                <div className="h-6 w-1/2 rounded bg-muted" />
                <div className="h-12 w-1/3 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Product not found
          </h2>
          <Link href="/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          {product.category.parentCategory && (
            <>
              <Link
                href={`/products?category=${product.category.parentCategory.slug}`}
                className="hover:text-primary"
              >
                {product.category.parentCategory.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-primary"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.title}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductImageGallery
            images={product.images}
            title={product.title}
            discount={discount}
            isFeatured={product.isFeatured}
          />
          <ProductInfo product={product} />
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} productId={productId} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
