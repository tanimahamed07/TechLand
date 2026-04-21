import { getSession } from "next-auth/react";
import {
  CheckoutSessionResponse,
  PaymentVerifyResponse,
  IAddress,
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

export interface CheckoutData {
  shippingAddress: IAddress;
  phone: string;
  orderNote?: string;
  deliveryZoneId?: string;
}

// ১. Checkout session তৈরি করা (Create Stripe Checkout Session)
export const createCheckoutSession = async (
  data: CheckoutData,
): Promise<CheckoutSessionResponse> => {
  const token = await getAuthToken();
  const response = await fetch(
    `${API_URL}/api/v1/payment/create-checkout-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result: CheckoutSessionResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to create checkout session");
  return result;
};

// ২. Payment verify করা (Verify Stripe Payment)
export const verifyPayment = async (
  sessionId: string,
): Promise<PaymentVerifyResponse> => {
  const token = await getAuthToken();
  const response = await fetch(
    `${API_URL}/api/v1/payment/verify/${sessionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result: PaymentVerifyResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to verify payment");
  return result;
};
