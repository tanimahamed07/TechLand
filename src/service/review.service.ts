import { API_URL, getAuthToken } from "@/utils/api.utils";
import type {
  Review,
  ReviewsResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
  SingleReviewResponse,
} from "@/types/review.types";

// Get reviews for specific product (Public - no auth required)
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

  return response.json();
};

// Add new review (Authentication required)
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

  return response.json();
};

// Get current user's reviews (Authentication required)
export const getMyReviews = async (): Promise<ReviewsResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/reviews/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return response.json();
};

// Update existing review (Authentication required)
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

  return response.json();
};

// Delete review (Authentication required)
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

  return response.json();
};

// Admin: Get all reviews with filters
export const adminGetAllReviews = async (params?: {
  page?: number;
  limit?: number;
  rating?: number;
}): Promise<ReviewsResponse> => {
  const token = await getAuthToken();
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.rating) query.set("rating", String(params.rating));

  const response = await fetch(`${API_URL}/api/v1/reviews?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return response.json();
};

// Re-export types for convenience
export type { Review, ReviewsResponse, CreateReviewPayload };
