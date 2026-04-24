// Product service types
export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  brand?: string;
  category: string;
  isFeatured?: boolean;
  images: string[];
  tags?: string[];
  specifications?: Record<string, string>;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sort?: string;
  isFeatured?: boolean;
}

export interface AdminProductFilters {
  page?: number;
  limit?: number;
  search?: string;
}

// AI service types
export interface GenerateDescriptionPayload {
  title: string;
  category: string;
  brand?: string;
  specs?: string[];
}

export interface GenerateDescriptionResponse {
  success: boolean;
  message: string;
  data: { description: string };
}

export interface GenerateTagsPayload {
  title: string;
  category: string;
}

export interface GenerateTagsResponse {
  success: boolean;
  message: string;
  data: { tags: string[] };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatPayload {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    reply: string;
  };
}

// Cart service types
export interface CartResponse {
  success: boolean;
  message: string;
  data?: import("./cart.types").ICart;
}

// Wishlist service types
export interface WishlistResponse {
  success: boolean;
  message: string;
  data: import("./product.types").Product[];
}

export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
}
