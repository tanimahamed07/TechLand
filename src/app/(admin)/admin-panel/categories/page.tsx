"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { confirmToast } from "@/utils/confirmToast";
import {
  getAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "@/service/category.service";
import type { Category } from "@/types/category.types";

interface FormValues {
  name: string;
  description?: string;
  image?: string;
  parentCategory?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isEditing = modal !== null && typeof modal === "object";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const fetchCategories = async () => {
    try {
      const result = await getAllCategories();
      setCategories(result.data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAllCategories();
        setCategories(result.data || []);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!modal) return;
    if (modal === "create") {
      reset({ name: "", description: "", image: "", parentCategory: "" });
    } else {
      reset({
        name: modal.name,
        description: modal.description || "",
        image: modal.image || "",
        parentCategory:
          typeof modal.parentCategory === "object"
            ? (modal.parentCategory as { _id: string })?._id
            : modal.parentCategory || "",
      });
    }
  }, [modal, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      image: values.image || undefined,
      parentCategory: values.parentCategory || undefined,
    };
    try {
      setSaving(true);
      if (isEditing) {
        await adminUpdateCategory((modal as Category)._id, payload);
        toast.success("Category updated");
      } else {
        await adminCreateCategory(payload);
        toast.success("Category created");
      }
      setModal(null);
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    const confirmed = await confirmToast(
      `Delete "${cat.name}"? Products will become uncategorised.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(cat._id);
      await adminDeleteCategory(cat._id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const parentOptions = categories.filter((c) => !c.parentCategory);

  const getParentName = (cat: Category) => {
    if (!cat.parentCategory) return null;
    const parentId =
      typeof cat.parentCategory === "object"
        ? (cat.parentCategory as { _id: string })?._id
        : cat.parentCategory;
    return categories.find((c) => c._id === parentId)?.name || null;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories total
          </p>
        </div>
        <Button onClick={() => setModal("create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="h-32 bg-muted" />
              <CardContent className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            <p className="text-sm">No categories yet.</p>
            <button
              onClick={() => setModal("create")}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Create your first category →
            </button>
          </div>
        ) : (
          categories.map((cat) => {
            const parentName = getParentName(cat);
            return (
              <Card key={cat._id} className="group overflow-hidden">
                {/* Image */}
                <div className="relative h-32 overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      cat.image ||
                      "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image"
                    }
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                    }}
                  />
                  <div className="absolute left-2 top-2">
                    {parentName ? (
                      <Badge className="bg-black/50 text-white backdrop-blur-sm hover:bg-black/50">
                        {parentName}
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/80 text-primary-foreground backdrop-blur-sm hover:bg-primary/80">
                        Main
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Info */}
                <CardContent className="p-4">
                  <h3 className="truncate font-semibold">{cat.name}</h3>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    /{cat.slug}
                  </p>
                  {cat.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex gap-2 border-t border-border pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setModal(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={deleting === cat._id}
                      onClick={() => handleDelete(cat)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deleting === cat._id ? "..." : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit Category" : "New Category"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setModal(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  {...register("image")}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="e.g. Smartphones"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Short description..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Parent Category{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <select
                  {...register("parentCategory")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">— None (main category) —</option>
                  {parentOptions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
