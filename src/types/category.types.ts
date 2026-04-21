// Category Interface - Backend থেকে আসা actual structure
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?:
    | {
        _id: string;
        name: string;
        slug: string;
      }
    | string; // String হতে পারে যদি শুধু ID থাকে
  createdAt?: string;
  updatedAt?: string;
}

// Category Tree Structure (nested children সহ)
export interface CategoryTree {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  children: CategoryTree[];
  brands?: string[]; // Category এর অধীনে available brands
}

// API Response Types
export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  meta?: {
    total: number;
  };
}

export interface CategoryTreeResponse {
  success: boolean;
  message: string;
  data: CategoryTree[];
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

// Category Create/Update Payload
export interface CategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentCategory?: string;
}
