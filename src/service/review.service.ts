import { getSession } from "next-auth/react";
import type {
  Review,
  ReviewsResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
  SingleReviewResponse,
} from "@/types/review.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }
  return session.accessToken as string;
};

// ১. নির্দিষ্ট প্রোডাক্টের রিভিউ নিয়ে আসা (Public - no auth required)
export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ReviewsResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/reviews/product/${productId}?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.statusText}`);
  }

  return response.json();
};

// ২. নতুন রিভিউ যোগ করা (authentication required)
export const addReview = async (
  reviewData: CreateReviewPayload,
): Promise<SingleReviewResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add review");
  }

  return response.json();
};

// ৩. নিজের সব রিভিউ নিয়ে আসা (authentication required)
export const getMyReviews = async (): Promise<ReviewsResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/reviews/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch your reviews");
  }

  return response.json();
};

// ৪. রিভিউ আপডেট করা (authentication required)
export const updateReview = async (
  reviewId: string,
  updateData: UpdateReviewPayload,
): Promise<SingleReviewResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update review");
  }

  return response.json();
};

// ৫. রিভিউ ডিলিট করা (authentication required)
export const deleteReview = async (
  reviewId: string,
): Promise<{ success: boolean; message: string }> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete review");
  }

  return response.json();
};

// Re-export types for convenience
export type { Review, ReviewsResponse, CreateReviewPayload };
