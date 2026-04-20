import { Product, ProductsResponse } from "@/types/product.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export const productService = {
  // Get all products with filters and pagination
  async getAllProducts(params?: {
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
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${API_URL}/api/v1/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/api/v1/products/featured`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch featured products: ${response.statusText}`,
      );
    }

    const result = await response.json();
    return result.data;
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/api/v1/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  },

  // Get products by category with pagination
  async getProductsByCategory(
    categorySlug: string | null,
    page: number = 1,
    limit: number = 12,
  ): Promise<ProductsResponse> {
    if (!categorySlug) {
      return this.getAllProducts({ page, limit });
    }
    return this.getAllProducts({ category: categorySlug, page, limit });
  },

  // Get products with search and pagination
  async searchProducts(
    searchQuery: string,
    page: number = 1,
    limit: number = 12,
  ): Promise<ProductsResponse> {
    return this.getAllProducts({ search: searchQuery, page, limit });
  },
};

// Export individual functions for backward compatibility
export const getCategoryTree = async () => {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

export const getProductsByCategory =
  productService.getProductsByCategory.bind(productService);
