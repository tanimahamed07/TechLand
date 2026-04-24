"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import ProductForm, {
  ProductFormValues,
} from "@/components/admin-panel/products/ProductForm";
import { adminUpdateProduct } from "@/service/product.service";
import { getProductById } from "@/service/product.service";
import type { Product } from "@/types/product.types";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  // Convert backend Product → form default values
  const toFormValues = (p: Product): Partial<ProductFormValues> => ({
    title: p.title,
    description: p.description,
    price: p.price,
    discount: (p as any).discount ?? 0,
    stock: p.stock,
    brand: p.brand ?? "",
    category: typeof p.category === "object" ? p.category._id : p.category,
    isFeatured: p.isFeatured ?? false,
    tags: (p.tags ?? []).join(", "),
    images: (p.images ?? []).map((url) => ({ url })),
    specs: p.specifications
      ? Object.entries(p.specifications).map(([key, value]) => ({ key, value }))
      : [],
  });

  const handleSubmit = async (values: ProductFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      price: values.price,
      discount: values.discount || 0,
      stock: values.stock,
      brand: values.brand || undefined,
      category: values.category,
      isFeatured: values.isFeatured,
      images: values.images.map((img) => img.url).filter(Boolean),
      tags: values.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      specifications: Object.fromEntries(
        values.specs
          .filter((s) => s.key && s.value)
          .map((s) => [s.key, s.value]),
      ),
    };

    await adminUpdateProduct(id, payload);
    toast.success("Product updated successfully!");
    router.push("/admin-panel/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin-panel/products"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product?.title ?? "Loading..."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : product ? (
        <ProductForm
          defaultValues={toFormValues(product)}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          Product not found.
        </p>
      )}
    </div>
  );
}
