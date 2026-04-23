"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";
import { getProductReviews, addReview } from "@/service/review.service";
import { useSession } from "next-auth/react";

interface ProductTabsProps {
  product: Product;
  productId: string;
}

export function ProductTabs({ product, productId }: ProductTabsProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Reviews fetch করা
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data.data || []);
        setReviewsTotal(data.meta?.total || 0);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (productId && activeTab === "reviews") {
      fetchReviews();
    }
  }, [productId, activeTab]);

  // Submit review handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert("Please login to submit a review");
      return;
    }

    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setSubmittingReview(true);
      await addReview({
        productId,
        rating: reviewRating,
        comment: reviewComment,
      });

      // Reset form
      setReviewRating(0);
      setReviewComment("");

      // Refetch reviews
      const data = await getProductReviews(productId);
      setReviews(data.data || []);
      setReviewsTotal(data.meta?.total || 0);

      alert("Review submitted successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit review";
      alert(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="border-b border-border">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
              activeTab === "description"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
              activeTab === "specifications"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Reviews ({reviewsTotal})
          </button>
        </div>
      </div>

      <div className="py-8">
        {activeTab === "description" && (
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <p className="text-foreground">{product.description}</p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {product.specifications &&
            Object.keys(product.specifications).length > 0 ? (
              Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between rounded-lg border border-border p-4"
                >
                  <span className="font-medium text-foreground">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No specifications available
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Reviews Summary */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Overall Rating */}
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="text-5xl font-bold text-primary">
                  {product.rating.toFixed(1)}
                </div>
                <div className="mt-2 flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Based on {reviewsTotal} reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2 md:col-span-2">
                {[
                  { star: 5, percentage: 75 },
                  { star: 4, percentage: 15 },
                  { star: 3, percentage: 5 },
                  { star: 2, percentage: 3 },
                  { star: 1, percentage: 2 },
                ].map(({ star, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-foreground">
                      {star} star
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Write a Review
                </h3>
                {!session ? (
                  <p className="text-center text-muted-foreground">
                    Please{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      login
                    </Link>{" "}
                    to write a review
                  </p>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Rating Input */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Your Rating *
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="transition hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= reviewRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted hover:fill-yellow-400 hover:text-yellow-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Your Review *
                      </label>
                      <textarea
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={submittingReview}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Customer Reviews
              </h3>

              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 w-32 rounded bg-muted" />
                          <div className="h-3 w-48 rounded bg-muted" />
                          <div className="h-16 rounded bg-muted" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                reviews.map((review) => (
                  <Card key={review._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                            {typeof review.userId === "object" &&
                            review.userId?.name
                              ? review.userId.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : "U"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {typeof review.userId === "object" &&
                              review.userId?.name
                                ? review.userId.name
                                : "Unknown User"}
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
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
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-foreground">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}