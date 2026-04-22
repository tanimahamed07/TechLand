import { getSession } from "next-auth/react";
import {
  OrdersResponse,
  OrderResponse,
  OrderTrackingResponse,
} from "@/types/order.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }
  return session.accessToken as string;
};

// ১. সব orders নিয়ে আসা (Get All Orders - user: own orders | admin: all orders)
export const getAllOrders = async (
  page = 1,
  limit = 10,
  status?: string,
): Promise<OrdersResponse> => {
  const token = await getAuthToken();

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const response = await fetch(`${API_URL}/api/v1/orders?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result: OrdersResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch orders");
  return result;
};

// ২. একটি order এর details নিয়ে আসা (Get Order By ID)
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result: OrderResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch order");
  return result;
};

// ৩. Order status update করা (Update Order Status - Admin only)
export const updateOrderStatus = async (
  orderId: string,
  orderStatus: string,
): Promise<OrderResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderStatus }),
  });

  const result: OrderResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update order status");
  return result;
};

// ৪. Order cancel করা (Cancel Order - User only, pending orders)
export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: OrderResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to cancel order");
  return result;
};

// ৫. Order track করা (Track Order - Public, no auth required)
export const trackOrder = async (
  orderNumber: string,
): Promise<OrderTrackingResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/orders/track/${orderNumber.toUpperCase()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const result: OrderTrackingResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to track order");
  return result;
};
