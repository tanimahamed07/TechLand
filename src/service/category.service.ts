import { API_URL, getAuthToken } from "@/utils/api.utils";
import type {
  CategoryTreeResponse,
  CategoriesResponse,
  SingleCategoryResponse,
  Category,
} from "@/types/category.types";

const BASE_URL = `${API_URL}/api/v1/categories`;

// Get category tree (cached)
export const getCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await fetch(`${BASE_URL}/tree`, {
    next: {
      tags: ["categories"],
      revalidate: 3600, // 1 hour
    },
  });
  return await response.json();
};

// Get all categories (cached)
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    next: {
      tags: ["categories"],
      revalidate: 3600, // 1 hour
    },
  });
  return await response.json();
};

// Get main categories only
export const getMainCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
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
  return await response.json();
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
  return await response.json();
};

// Admin: Delete category
export const adminDeleteCategory = async (id: string): Promise<void> => {
  const token = await getAuthToken();
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
