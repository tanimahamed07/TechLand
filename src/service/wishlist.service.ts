import { API_URL, getAuthToken } from "@/utils/api.utils";
import {
  WishlistResponse,
  ToggleWishlistResponse,
} from "@/types/service.types";


// Get current user's wishlist
export const getMyWishlist = async (): Promise<WishlistResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return await response.json();
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
  return await response.json();
};
