import type { Address, UserProfile } from "./user.types";

// Register Payload
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
}

// Login Payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Auth Response
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
    token: string;
  };
}

// Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Token Payload (JWT decode করার পর)
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
