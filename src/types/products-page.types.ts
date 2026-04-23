export type SortOption =
  | "newest"
  | "price-low"
  | "price-high"
  | "rating"
  | "popular";

export interface CategoryTree {
  _id: string;
  name: string;
  slug: string;
  children: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
}

export interface ProductsPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UrlParamUpdates {
  category?: string | null;
  subcategory?: string | null;
  brand?: string | null;
  priceMin?: string | null;
  priceMax?: string | null;
  rating?: string | null;
  search?: string | null;
}
