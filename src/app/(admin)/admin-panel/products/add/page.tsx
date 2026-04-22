"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import ProductForm, {
  ProductFormValues,
} from "@/components/admin-panel/products/ProductForm";
import { adminCreateProduct } from "@/service/admin.product.service";

export default function AddProductPage() {
  const router = useRouter();

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

    await adminCreateProduct(payload);
    toast.success("Product created successfully!");
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
          <h1 className="text-2xl font-bold">Add Product</h1>
          <p className="text-sm text-muted-foreground">Create a new product</p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </div>
  );
}
