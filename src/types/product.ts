export interface IProduct {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  stock?: number;
  specifications?: Record<string, string>;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "newest" | "price-low" | "price-high" | "rating";
}
