import { getSession } from "next-auth/react";
import { ICart } from "@/types/cart.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }
  return session.accessToken as string;
};

// API Response Type
interface CartResponse {
  success: boolean;
  message: string;
  data?: ICart;
}

// ১. কার্ট দেখা (Get Cart)
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
  if (!response.ok) throw new Error(result.message || "Failed to fetch cart");

  // Empty cart হলে default structure return করা
  return result.data || ({ items: [], totalAmount: 0 } as unknown as ICart);
};

// ২. কার্টে প্রোডাক্ট যোগ করা (Add to Cart)
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
  if (!response.ok)
    throw new Error(result.message || "Failed to add item to cart");
  return result.data!;
};

// ৩. কার্ট আইটেম আপডেট করা (Update Cart Item Quantity)
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
  if (!response.ok)
    throw new Error(result.message || "Failed to update cart item");
  return result.data!;
};

// ৪. কার্ট থেকে আইটেম মুছে ফেলা (Remove Cart Item)
export const removeCartItem = async (itemId: string): Promise<ICart> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/cart/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: CartResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to remove cart item");
  return result.data!;
};

// ৫. পুরো কার্ট খালি করা (Clear Cart)
export const clearCart = async (): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: CartResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to clear cart");
};
