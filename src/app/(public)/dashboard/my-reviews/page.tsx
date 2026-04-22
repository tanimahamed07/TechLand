"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Edit2,
  MessageSquare,
  Save,
  Star,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { confirmToast } from "@/utils/confirmToast";

// Shadcn UI Components
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  getMyReviews,
  updateReview,
  deleteReview,
} from "@/service/review.service";
import type { Review } from "@/types/review.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopulatedReview extends Omit<Review, "productId"> {
  productId: {
    _id: string;
    title: string;
    images: string[];
  };
}

// ─── Star Rating Picker ───────────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

function EditForm({
  review,
  onDone,
}: {
  review: PopulatedReview;
  onDone: () => void;
}) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateReview(review._id, { rating, comment });
      toast.success("Review updated");
      onDone();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update review",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 space-y-4 border-t pt-4 bg-muted/20 p-3 rounded-b-lg">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Update Rating
        </label>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Update Comment
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          className="resize-none focus-visible:ring-1 text-sm"
          placeholder="Share your updated experience..."
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={saving || !comment.trim()}
          size="sm"
          className="h-8"
        >
          {saving ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Save className="mr-2 h-3 w-3" />
          )}
          Save Changes
        </Button>
        <Button onClick={onDone} variant="outline" size="sm" className="h-8">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<PopulatedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!session?.user) return;
    try {
      setRefreshing(true);
      const result = await getMyReviews();
      setReviews((result.data || []) as unknown as PopulatedReview[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return;
      try {
        setRefreshing(true);
        const result = await getMyReviews();
        setReviews((result.data || []) as unknown as PopulatedReview[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    load();
  }, [session]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirmToast(
      "Delete this review? This cannot be undone.",
    );
    if (!confirmed) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete review",
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Consistent with Order Page */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <Button
          onClick={fetchReviews}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground/20" />
          <div>
            <p className="font-semibold text-lg mb-1">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Purchase products and share your experience!
            </p>
          </div>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const product = review.productId;
            const isEditing = editingId === review._id;

            return (
              <div
                key={review._id}
                className="rounded-lg border border-border bg-card shadow-sm overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${product._id}`}
                      className="shrink-0"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      {/* Product Title & Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="font-bold text-sm line-clamp-1 hover:text-primary transition-colors"
                        >
                          {product.title}
                        </Link>

                        {!isEditing && (
                          <div className="flex shrink-0 gap-3">
                            <button
                              onClick={() => setEditingId(review._id)}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="text-xs text-destructive hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stars & Date (Same as Order Page meta style) */}
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Comment */}
                      {!isEditing && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 italic">
                          {review.comment}
                        </p>
                      )}

                      {/* Inline Edit Form */}
                      {isEditing && (
                        <EditForm
                          review={review}
                          onDone={() => {
                            setEditingId(null);
                            fetchReviews();
                          }}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
