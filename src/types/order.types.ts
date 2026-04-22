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
  userId:
    | string
    | { _id: string; name: string; email: string; avatar?: string };
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

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: IOrder[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderTrackingResponse {
  success: boolean;
  message: string;
  data: {
    orderNumber: string;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    deliveryCharge?: number;
    orderNote?: string;
    items: Array<{
      title: string;
      quantity: number;
      image: string;
      price: number;
    }>;
    createdAt: string;
    updatedAt: string;
  };
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
