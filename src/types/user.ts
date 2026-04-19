export type UserRole = "user" | "admin" | "super-admin";

export interface Address {
  street?: string;
  city?: string;
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
}
