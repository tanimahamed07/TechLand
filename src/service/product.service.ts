import { getSession } from "next-auth/react";
import {
  Product,
  ProductsResponse,
  SingleProductResponse,
} from "@/types/product.types";
import {
  ProductPayload,
  ProductFilters,
  AdminProductFilters,
} from "@/types/service.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Get auth token for admin operations
const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

// Normalize discount prices
const normalizeDiscountPrice = (product: Product): Product => {
  if (product.discount && !product.discountPrice) {
    product.discountPrice = Math.round(
      product.price * (1 - product.discount / 100),
    );
  }
  return product;
};

// ========== PUBLIC PRODUCT OPERATIONS ==========

// Get all products with filters and pagination
export const getAllProducts = async (
  params?: ProductFilters,
): Promise<ProductsResponse> => {
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
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to fetch products:", {
      url,
      status: response.status,
      error: errorData,
    });
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result = await response.json();

  // Normalize discount prices for all products
  if (result.data && Array.isArray(result.data)) {
    result.data = result.data.map(normalizeDiscountPrice);
  }

  return result;
};

// Get featured products
export const getFeaturedProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch(`${API_URL}/api/v1/products/featured`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch featured products: ${response.statusText}`,
    );
  }

  const result = await response.json();

  // Normalize discount prices for all products
  if (result.data && Array.isArray(result.data)) {
    result.data = result.data.map(normalizeDiscountPrice);
  }

  return result;
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const url = `${API_URL}/api/v1/products/${id}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Failed to fetch product:`, {
      status: response.status,
      error: errorData,
    });
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const result = await response.json();
  const product = result.data;

  return normalizeDiscountPrice(product);
};

// Get products by category with pagination
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

// Search products with pagination
export const searchProducts = async (
  searchQuery: string,
  page: number = 1,
  limit: number = 12,
): Promise<ProductsResponse> => {
  return getAllProducts({ search: searchQuery, page, limit });
};

// ========== ADMIN PRODUCT OPERATIONS ==========

// Admin: Get all products with pagination
export const adminGetAllProducts = async (
  params?: AdminProductFilters,
): Promise<ProductsResponse> => {
  const token = await getAuthToken();
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);

  const response = await fetch(`${API_URL}/api/v1/products?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const result: ProductsResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to fetch products");
  return result;
};

// Admin: Create product
export const adminCreateProduct = async (
  data: ProductPayload,
): Promise<SingleProductResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: SingleProductResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to create product");
  return result;
};

// Admin: Update product
export const adminUpdateProduct = async (
  id: string,
  data: Partial<ProductPayload>,
): Promise<SingleProductResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: SingleProductResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update product");
  return result;
};

// Admin: Delete product
export const adminDeleteProduct = async (id: string): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete product");
  }
};
