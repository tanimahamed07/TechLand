const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  productId: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AddReviewData {
  productId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  // Get reviews for a specific product
  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ReviewsResponse> {
    const response = await fetch(
      `${API_URL}/api/v1/reviews/product/${productId}?page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    return response.json();
  },

  // Add a new review (requires authentication)
  async addReview(
    reviewData: AddReviewData,
    token: string,
  ): Promise<{ success: boolean; message: string; data: Review }> {
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
  },

  // Get current user's reviews (requires authentication)
  async getMyReviews(
    token: string,
  ): Promise<{ success: boolean; message: string; data: Review[] }> {
    const response = await fetch(`${API_URL}/api/v1/reviews/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch your reviews");
    }

    return response.json();
  },

  // Update a review (requires authentication)
  async updateReview(
    reviewId: string,
    updateData: { rating?: number; comment?: string },
    token: string,
  ): Promise<{ success: boolean; message: string; data: Review }> {
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
  },

  // Delete a review (requires authentication)
  async deleteReview(
    reviewId: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
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
  },
};
