import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductById, getAllProducts } from "@/service/product.service";
import { ProductImageGallery } from "@/components/product-details/ProductImageGallery";
import { ProductInfo } from "@/components/product-details/ProductInfo";
import { ProductTabs } from "@/components/product-details/ProductTabs";
import { RelatedProducts } from "@/components/product-details/RelatedProducts";
import { notFound } from "next/navigation";
import { Product } from "@/types/product.types";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = await params;

  let product;
  try {
    product = await getProductById(productId);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Related products fetch - backend theke category filter kore anchi
  let relatedProducts: Product[] = [];
  if (product.category?.slug) {
    try {
      // First try: Same category products
      const relatedData = await getAllProducts({
        category: product.category.slug,
        limit: 8,
      });

      // Filter out current product
      const sameCategoryProducts = relatedData.data.filter(
        (p) => p._id !== product._id,
      );

      // If we have enough products from same category, use them
      if (sameCategoryProducts.length >= 4) {
        relatedProducts = sameCategoryProducts.slice(0, 4);
      } else {
        // Not enough in same category, add same brand products
        relatedProducts = [...sameCategoryProducts];

        if (product.brand && relatedProducts.length < 4) {
          try {
            const brandData = await getAllProducts({
              brand: product.brand,
              limit: 8,
            });

            const sameBrandProducts = brandData.data.filter(
              (p) =>
                p._id !== product._id &&
                !relatedProducts.some((rp) => rp._id === p._id),
            );

            relatedProducts = [...relatedProducts, ...sameBrandProducts].slice(
              0,
              4,
            );
          } catch (error) {
            console.error("Failed to fetch brand products:", error);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
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
