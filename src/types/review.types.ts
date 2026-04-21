// Review Interface
export interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
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

export interface SingleReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}

// Review Create Payload
export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

// Review Update Payload
export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}
