import {
  UserProfile,
  UserResponse,
  UsersResponse,
  UpdateProfileData,
  UpdatePasswordData,
} from "@/types/user.types";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Get auth token for user operations
const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

// Get current user profile
export const getMyProfile = async (): Promise<UserProfile> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const result: UserResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to fetch profile");
  return result.data;
};

// Update user profile
export const updateMyProfile = async (
  data: UpdateProfileData,
): Promise<UserProfile> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: UserResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update profile");
  return result.data;
};

// Update user password
export const updatePassword = async (
  data: UpdatePasswordData,
): Promise<UserProfile> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: UserResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update password");
  return result.data;
};

// Admin: Get all users with filters
export const adminGetAllUsers = async (params?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}): Promise<UsersResponse> => {
  const token = await getAuthToken();
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.role) query.set("role", params.role);
  if (params?.search) query.set("search", params.search);

  const response = await fetch(`${API_URL}/api/v1/users?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const result: UsersResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch users");
  return result;
};

// Super-Admin: Update user role
export const adminUpdateUserRole = async (
  userId: string,
  role: string,
): Promise<UserResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, role }),
  });
  const result: UserResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update role");
  return result;
};

// Super-Admin: Create new admin user
export const adminCreateAdmin = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<UserResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, role: "admin" }),
  });
  const result: UserResponse = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to create admin");
  return result;
};

// Super-Admin: Delete user
export const adminDeleteUser = async (userId: string): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete user");
  }
};
