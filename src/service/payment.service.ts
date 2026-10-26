import { API_URL, getAuthToken } from "@/utils/api.utils";
import {
  CheckoutSessionResponse,
  PaymentVerifyResponse,
  IAddress,
} from "@/types/order.types";

export interface CheckoutData {
  shippingAddress: IAddress;
  phone: string;
  orderNote?: string;
  deliveryZoneId?: string;
}

// Create Stripe checkout session
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

  return await response.json();
};

// Verify payment status after Stripe redirect
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

  return await response.json();
};
