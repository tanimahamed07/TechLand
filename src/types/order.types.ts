export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface IAddress {
  street?: string;
  city?: string;
  country?: string;
  zip?: string;
}

export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IAddress;
  phone: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  couponDiscount?: number;
  deliveryCharge?: number;
  orderNote?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface OrderResponse {
  success: boolean;
  message: string;
  data: IOrder;
}

export interface CheckoutSessionResponse {
  success: boolean;
  message: string;
  data: {
    sessionId: string;
    url: string;
    orderId: string;
  };
}

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  data: {
    paymentStatus: string;
    orderId: string;
  };
}
