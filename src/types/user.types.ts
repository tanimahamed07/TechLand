// User Role Type
export type UserRole = "user" | "admin" | "super-admin";

// Address Interface
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

// User Profile Interface
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

// API Response Types
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

// User Update Payload
export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: Address;
}
