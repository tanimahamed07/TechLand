"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/service/category.service";
import type { Category } from "@/types/category.types";

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  brand: string;
  category: string;
  isFeatured: boolean;
  tags: string;
  images: { url: string }[];
  specs: { key: string; value: string }[];
}

interface Props {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  submitLabel?: string;
}

export default function ProductForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discount: 0,
      stock: 0,
      brand: "",
      category: "",
      isFeatured: false,
      tags: "",
      images: [{ url: "" }],
      specs: [],
      ...defaultValues,
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specs" });

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const watchedPrice = watch("price");
  const watchedDiscount = watch("discount");
  const discountedPrice =
    watchedPrice > 0 && watchedDiscount > 0
      ? watchedPrice * (1 - watchedDiscount / 100)
      : null;

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ── Left col (2/3) ── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Basic Information
            </h3>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="Product title"
                className={inputClass}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={5}
                placeholder="Product description..."
                className={`${inputClass} resize-none`}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price / Discount / Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Price (৳) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Must be positive" },
                  })}
                  className={inputClass}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register("discount", { valueAsNumber: true })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Stock <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("stock", {
                    required: "Stock is required",
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            {/* Brand / Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Brand</label>
                <input
                  {...register("brand")}
                  placeholder="e.g. Apple"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={inputClass}
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Tags{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (comma-separated)
                </span>
              </label>
              <input
                {...register("tags")}
                placeholder="laptop, electronics, apple..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Specifications
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSpec({ key: "", value: "" })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Spec
              </Button>
            </div>
            {specFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-3">
                No specifications added yet.
              </p>
            )}
            {specFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`specs.${i}.key`)}
                  placeholder="e.g. RAM"
                  className={`${inputClass} flex-1`}
                />
                <input
                  {...register(`specs.${i}.value`)}
                  placeholder="e.g. 16GB"
                  className={`${inputClass} flex-1`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpec(i)}
                  className="text-destructive hover:bg-destructive/10 px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right col (1/3) ── */}
        <div className="space-y-5">
          {/* Images */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Images{" "}
                <span className="text-xs font-normal">
                  ({imageFields.length})
                </span>
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendImage({ url: "" })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>

            {imageFields.map((field, i) => {
              const url = watch(`images.${i}.url`);
              return (
                <div key={field.id} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      {...register(
                        `images.${i}.url`,
                        i === 0
                          ? { required: "At least one image URL is required" }
                          : {},
                      )}
                      placeholder="https://example.com/image.jpg"
                      className={`${inputClass} flex-1`}
                    />
                    {imageFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(i)}
                        className="text-destructive hover:bg-destructive/10 px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {/* Image preview */}
                  {url && (
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={url}
                        alt={`Image ${i + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="200px"
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {errors.images?.[0]?.url && (
              <p className="text-xs text-destructive">
                {errors.images[0].url.message}
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Settings
            </h3>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium">Featured Product</p>
                <p className="text-xs text-muted-foreground">
                  Show on homepage
                </p>
              </div>
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="h-4 w-4 accent-primary"
              />
            </label>

            {/* Price preview */}
            {discountedPrice !== null && (
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Price Preview
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    ৳{discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ৳{Number(watchedPrice).toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="text-xs text-green-600">
                    -{watchedDiscount}%
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
