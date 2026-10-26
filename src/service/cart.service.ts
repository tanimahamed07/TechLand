import { API_URL, getAuthToken } from "@/utils/api.utils";
import { ICart } from "@/types/cart.types";
import { CartResponse } from "@/types/service.types";

// Get user cart
export const getCart = async (): Promise<ICart> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result: CartResponse = await response.json();

  // Return empty cart structure if no data
  return result.data || ({ items: [], totalAmount: 0 } as unknown as ICart);
};

// Add product to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1,
): Promise<ICart> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/cart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
  });

  const result: CartResponse = await response.json();
  return result.data!;
};

// Update cart item quantity
export const updateCartItem = async (
  itemId: string,
  quantity: number,
): Promise<ICart> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/cart/${itemId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  const result: CartResponse = await response.json();
  return result.data!;
};

// Remove item from cart
export const removeCartItem = async (itemId: string): Promise<ICart> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/cart/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: CartResponse = await response.json();
  return result.data!;
};

// Clear entire cart
export const clearCart = async (): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await response.json();
};
