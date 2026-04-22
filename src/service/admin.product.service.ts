import { getSession } from "next-auth/react";
import {
  Product,
  ProductsResponse,
  SingleProductResponse,
} from "@/types/product.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  brand?: string;
  category: string;
  isFeatured?: boolean;
  images: string[];
  tags?: string[];
  specifications?: Record<string, string>;
}

// Admin: Get all products with pagination
export const adminGetAllProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ProductsResponse> => {
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
