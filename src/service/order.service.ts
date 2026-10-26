import { API_URL, getAuthToken } from "@/utils/api.utils";
import {
  OrdersResponse,
  OrderResponse,
  OrderTrackingResponse,
} from "@/types/order.types";



// Get all orders (user: own orders | admin: all orders)
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

  return await response.json();
};

// Get order details by ID
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return await response.json();
};

// Update order status (Admin only)
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

  return await response.json();
};

// Cancel order (User only, pending orders)
export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// Track order by order number (Public, no auth required)
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

  return await response.json();
};
