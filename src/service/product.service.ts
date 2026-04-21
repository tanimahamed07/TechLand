import { Product, ProductsResponse } from "@/types/product.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// ১. সব প্রোডাক্ট নিয়ে আসা (filters এবং pagination সহ)
export const getAllProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sort?: string;
  isFeatured?: boolean;
}): Promise<ProductsResponse> => {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${API_URL}/api/v1/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
};

// ২. ফিচার্ড প্রোডাক্ট নিয়ে আসা
export const getFeaturedProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch(`${API_URL}/api/v1/products/featured`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch featured products: ${response.statusText}`,
    );
  }

  return response.json();
};

// ৩. নির্দিষ্ট প্রোডাক্ট আইডি দিয়ে নিয়ে আসা
export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

// ৪. ক্যাটাগরি অনুযায়ী প্রোডাক্ট নিয়ে আসা (pagination সহ)
export const getProductsByCategory = async (
  categorySlug: string | null,
  page: number = 1,
  limit: number = 12,
): Promise<ProductsResponse> => {
  if (!categorySlug) {
    return getAllProducts({ page, limit });
  }
  return getAllProducts({ category: categorySlug, page, limit });
};

// ৫. সার্চ করে প্রোডাক্ট নিয়ে আসা (pagination সহ)
export const searchProducts = async (
  searchQuery: string,
  page: number = 1,
  limit: number = 12,
): Promise<ProductsResponse> => {
  return getAllProducts({ search: searchQuery, page, limit });
};
