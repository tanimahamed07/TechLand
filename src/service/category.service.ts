import type {
  CategoryTreeResponse,
  CategoriesResponse,
  SingleCategoryResponse,
  Category,
} from "@/types/category.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
const BASE_URL = `${API_URL}/api/v1/categories`;

// ১. সকল ক্যাটাগরি ট্রি আকারে নিয়ে আসা (Main categories with children)
export const getCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await fetch(`${BASE_URL}/tree`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch category tree");
  return await response.json();
};

// ২. সকল ক্যাটাগরির লিস্ট নিয়ে আসা (All categories flat)
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return await response.json();
};

// ৩. শুধু মেইন ক্যাটাগরি (যাদের parent নেই)
export const getMainCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  const result: CategoriesResponse = await response.json();

  // Filter করে শুধু main categories return করা (যাদের parentCategory নেই)
  const mainCategories = result.data.filter(
    (cat: Category) => !cat.parentCategory,
  );
  return { ...result, data: mainCategories };
};

// ৪. নির্দিষ্ট parent এর অধীনে সব subcategories
export const getSubcategoriesByParent = async (
  parentId: string,
): Promise<CategoriesResponse> => {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  const result: CategoriesResponse = await response.json();

  // Filter করে নির্দিষ্ট parent এর subcategories return করা
  const subcategories = result.data.filter(
    (cat: Category) =>
      typeof cat.parentCategory === "string" && cat.parentCategory === parentId,
  );
  return { ...result, data: subcategories };
};

// ৫. নির্দিষ্ট আইডি দিয়ে ক্যাটাগরি খুঁজে বের করা
export const getCategoryById = async (
  id: string,
): Promise<SingleCategoryResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Category not found");
  return await response.json();
};

// ৬. নতুন ক্যাটাগরি তৈরি করা (Admin Only)
export const createCategory = async (
  categoryData: Partial<Category>,
  token: string,
): Promise<SingleCategoryResponse> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return await response.json();
};

// ৭. ক্যাটাগরি আপডেট করা (Admin Only)
export const updateCategory = async (
  id: string,
  updateData: Partial<Category>,
  token: string,
): Promise<SingleCategoryResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return await response.json();
};

// ৮. ক্যাটাগরি ডিলিট করা (Admin Only)
export const deleteCategory = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete category");
  return await response.json();
};
