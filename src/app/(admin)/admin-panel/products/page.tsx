"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { confirmToast } from "@/utils/confirmToast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  adminGetAllProducts,
  adminDeleteProduct,
} from "@/service/admin.product.service";
import type { Product } from "@/types/product.types";
import { getValidImageUrl } from "@/utils/imageUtils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async (p = page, s = search) => {
    try {
      setLoading(true);
      const result = await adminGetAllProducts({
        page: p,
        limit: 10,
        search: s || undefined,
      });
      setProducts(result.data || []);
      setTotalPages(result.meta?.totalPages || 1);
      setTotal(result.meta?.total || 0);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await adminGetAllProducts({
          page,
          limit: 10,
          search: search || undefined,
        });
        setProducts(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
        setTotal(result.meta?.total || 0);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search);
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirmToast(
      `Delete "${title}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      setDeleting(id);
      await adminDeleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {total} total products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin-panel/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            setPage(1);
            fetchProducts(1, "");
          }}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </form>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-auto">
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border-b border-border last:border-0"
              >
                <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p>No products found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Stock
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={getValidImageUrl(product.images)}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          sizes="48px"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {typeof product.category === "object"
                      ? product.category.name
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-primary">
                        $
                        {(
                          product.discountPrice || product.price
                        ).toLocaleString()}
                      </p>
                      {product.discountPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          ${product.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        product.stock === 0
                          ? "destructive"
                          : product.stock < 10
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} left`}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {product.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Featured
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Link
                          href={`/admin-panel/products/${product._id}/edit`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        disabled={deleting === product._id}
                        onClick={() => handleDelete(product._id, product.title)}
                      >
                        {deleting === product._id ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
