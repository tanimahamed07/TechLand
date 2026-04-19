import type { Address, UserProfile } from "./user";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
    token: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
