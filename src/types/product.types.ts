export interface Product {
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
  createdBy?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

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
