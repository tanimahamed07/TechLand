export type UserRole = "user" | "admin" | "super-admin";

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

// API রেসপন্স টাইপগুলো সার্ভিসে ব্যবহার করার জন্য
export interface UserResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: UserProfile[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}