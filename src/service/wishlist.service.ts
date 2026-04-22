import { getSession } from "next-auth/react";
import { Product } from "@/types/product.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
}

// Get my wishlist
export const getMyWishlist = async (): Promise<WishlistResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const result: WishlistResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to fetch wishlist");
  return result;
};

// Toggle product in wishlist (add/remove)
export const toggleWishlist = async (
  productId: string,
): Promise<ToggleWishlistResponse> => {
  const token = await getAuthToken();
  const response = await fetch(
    `${API_URL}/api/v1/users/wishlist/${productId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const result: ToggleWishlistResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update wishlist");
  return result;
};
