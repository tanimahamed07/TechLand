"use client";

import React, { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmToast } from "@/utils/confirmToast";
import { adminGetAllReviews, deleteReview } from "@/service/review.service";
import type { Review } from "@/types/review.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUser(review: Review) {
  if (review.userId && typeof review.userId === "object") return review.userId;
  return null;
}

function getProduct(review: Review) {
  if (review.productId && typeof review.productId === "object")
    return review.productId;
  return null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating}/5</span>
    </div>
  );
}

const RATING_TABS = [
  { label: "All", value: 0 },
  { label: "★ 5", value: 5 },
  { label: "★ 4", value: 4 },
  { label: "★ 3", value: 3 },
  { label: "★ 2", value: 2 },
  { label: "★ 1", value: 1 },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

import { getValidImageUrl } from "@/utils/imageUtils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReviews = async (p = page, rating = ratingFilter) => {
    try {
      setLoading(true);
      const result = await adminGetAllReviews({
        page: p,
        limit: 15,
        rating: rating || undefined,
      });
      setReviews(result.data || []);
      setTotalPages(result.meta?.totalPages || 1);
      setTotal(result.meta?.total || 0);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await adminGetAllReviews({
          page,
          limit: 15,
          rating: ratingFilter || undefined,
        });
        setReviews(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
        setTotal(result.meta?.total || 0);
      } catch {
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, ratingFilter]);

  const handleDelete = async (review: Review) => {
    const user = getUser(review);
    const product = getProduct(review);
    const confirmed = await confirmToast(
      `Delete review by "${user?.name ?? "Unknown"}" on "${product?.title ?? "product"}"?`,
    );
    if (!confirmed) return;

    try {
      setDeleting(review._id);
      await deleteReview(review._id);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  // Client-side search
  const filtered = search.trim()
    ? reviews.filter((r) => {
        const q = search.toLowerCase();
        const user = getUser(r);
        const product = getProduct(r);
        return (
          user?.name?.toLowerCase().includes(q) ||
          product?.title?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q)
        );
      })
    : reviews;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-sm text-muted-foreground">{total} reviews total</p>
        </div>
        <Input
          type="text"
          placeholder="Search reviewer or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {/* Rating Tabs */}
      <div className="flex flex-wrap gap-1">
        {RATING_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={ratingFilter === tab.value ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setRatingFilter(tab.value);
              setPage(1);
              setSearch("");
            }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Reviewer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Comment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    {search
                      ? `No reviews match "${search}"`
                      : "No reviews found."}
                  </td>
                </tr>
              ) : (
                filtered.map((review) => {
                  const user = getUser(review);
                  const product = getProduct(review);

                  return (
                    <tr
                      key={review._id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {product?.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getValidImageUrl(product.images)}
                              alt={product.title}
                              className="h-9 w-9 shrink-0 rounded-lg border object-cover"
                            />
                          ) : (
                            <div className="h-9 w-9 shrink-0 rounded-lg bg-muted" />
                          )}
                          <span className="max-w-[140px] truncate font-medium">
                            {product?.title ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Reviewer */}
                      <td className="px-4 py-3">
                        {user ? (
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                user.avatar ||
                                `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user._id}`
                              }
                              alt={user.name}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                            <span className="max-w-[120px] truncate text-sm">
                              {user.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        <StarRating rating={review.rating} />
                      </td>

                      {/* Comment */}
                      <td className="max-w-xs px-4 py-3">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(review)}
                          disabled={deleting === review._id}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
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
    </div>
  );
}
