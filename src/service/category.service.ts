import { getSession } from "next-auth/react";
import type {
  CategoryTreeResponse,
  CategoriesResponse,
  SingleCategoryResponse,
  Category,
} from "@/types/category.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
const BASE_URL = `${API_URL}/api/v1/categories`;

const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

// Get category tree
export const getCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await fetch(`${BASE_URL}/tree`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch category tree");
  return await response.json();
};

// Get all categories
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return await response.json();
};

// Get main categories only
export const getMainCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  const result: CategoriesResponse = await response.json();

  // Filter main categories (no parent)
  const mainCategories = result.data.filter(
    (cat: Category) => !cat.parentCategory,
  );
  return { ...result, data: mainCategories };
};

// Get subcategories by parent
export const getSubcategoriesByParent = async (
  parentId: string,
): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  const result: CategoriesResponse = await response.json();

  // Filter subcategories by parent
  const subcategories = result.data.filter(
    (cat: Category) =>
      typeof cat.parentCategory === "string" && cat.parentCategory === parentId,
  );
  return { ...result, data: subcategories };
};

// Get category by ID
export const getCategoryById = async (
  id: string,
): Promise<SingleCategoryResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Category not found");
  return await response.json();
};

// Admin: Create category
export const adminCreateCategory = async (
  categoryData: Partial<Category>,
): Promise<SingleCategoryResponse> => {
  const token = await getAuthToken();
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  const result: SingleCategoryResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to create category");
  return result;
};

// Admin: Update category
export const adminUpdateCategory = async (
  id: string,
  updateData: Partial<Category>,
): Promise<SingleCategoryResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  const result: SingleCategoryResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update category");
  return result;
};

// Admin: Delete category
export const adminDeleteCategory = async (id: string): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete category");
  }
};
