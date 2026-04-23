// Product Interface - Backend থেকে আসা actual structure
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
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
  numReviews?: number;
  reviewCount?: number;
  isFeatured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  createdBy?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Filter & Query Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  isFeatured?: boolean;
}

export interface ProductQueryParams extends ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
}
