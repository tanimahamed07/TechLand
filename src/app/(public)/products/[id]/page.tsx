"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ShoppingCart,
  Share2,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { productService } from "@/service/product.service";
import { reviewService } from "@/service/review.service";
import type { Review } from "@/types/review.types";
import { useSession } from "next-auth/react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
    parentCategory?: {
      _id: string;
      name: string;
      slug: string;
    };
  };
  brand: string;
  images: string[];
  stock: number;
  sold: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const { data: session } = useSession();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [reviewsTotal, setReviewsTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [reviewsLoading, setReviewsLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<
    "description" | "specifications" | "reviews"
  >("description");

  // Review form state
  const [reviewRating, setReviewRating] = React.useState(0);
  const [reviewComment, setReviewComment] = React.useState("");
  const [submittingReview, setSubmittingReview] = React.useState(false);

  // Product fetch করা
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);

        // Related products fetch করা (same category)
        if (data.category?._id) {
          const relatedData = await productService.getAllProducts({
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

  // Reviews fetch করা
  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await reviewService.getProductReviews(productId);
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
      await reviewService.addReview(
        {
          productId,
          rating: reviewRating,
          comment: reviewComment,
        },
        session.accessToken,
      );

      // Reset form
      setReviewRating(0);
      setReviewComment("");

      // Refetch reviews
      const data = await reviewService.getProductReviews(productId);
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

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              {discount > 0 && (
                <Badge className="absolute left-4 top-4 z-10 bg-destructive text-destructive-foreground">
                  -{discount}% OFF
                </Badge>
              )}
              {product.isFeatured && (
                <Badge className="absolute right-4 top-4 z-10 bg-primary text-primary-foreground">
                  FEATURED
                </Badge>
              )}
              <Image
                src={
                  product.images[selectedImage] ||
                  "https://placehold.co/600x600/e2e8f0/64748b?text=No+Image"
                }
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.brand}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground">
                {product.title}
              </h1>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
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
                <span className="ml-2 text-sm font-medium text-foreground">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.numReviews} reviews)
              </span>
              <span className="text-sm text-muted-foreground">
                • {product.sold} sold
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ৳{(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <p className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                    In Stock ({product.stock} available)
                  </span>
                </p>
              ) : (
                <p className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="font-medium text-destructive">
                    Out of Stock
                  </span>
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Free Shipping
                    </p>
                    <p className="text-xs text-muted-foreground">
                      On orders over ৳5000
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Secure Payment
                    </p>
                    <p className="text-xs text-muted-foreground">100% secure</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Easy Returns
                    </p>
                    <p className="text-xs text-muted-foreground">
                      7 days return
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
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
                                {review.userId.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">
                                  {review.userId.name}
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
                                    {new Date(
                                      review.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
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

        {/* Related Products */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Related Products
              {relatedProducts.length > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({relatedProducts.length})
                </span>
              )}
            </h2>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No related products found
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct._id}
                  className="group overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <Link href={`/products/${relatedProduct._id}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {relatedProduct.discountPrice && (
                        <Badge className="absolute left-3 top-3 z-10 bg-pink-500 text-white">
                          -
                          {Math.round(
                            ((relatedProduct.price -
                              relatedProduct.discountPrice) /
                              relatedProduct.price) *
                              100,
                          )}
                          %
                        </Badge>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-md transition hover:bg-pink-50"
                      >
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                      <Image
                        src={
                          relatedProduct.images[0] ||
                          "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
                        }
                        alt={relatedProduct.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <CardContent className="px-4 pt-0 pb-4">
                    <Link href={`/products/${relatedProduct._id}`}>
                      <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">
                        {relatedProduct.brand}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground hover:text-primary">
                        {relatedProduct.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(relatedProduct.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({relatedProduct.numReviews})
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-lg font-bold text-primary">
                          ৳
                          {(
                            relatedProduct.discountPrice || relatedProduct.price
                          ).toLocaleString()}
                        </p>
                        {relatedProduct.discountPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            ৳{relatedProduct.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>

                    {/* Add to Cart Button */}
                    <Button
                      className="mt-4 w-full gap-2"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart functionality
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
