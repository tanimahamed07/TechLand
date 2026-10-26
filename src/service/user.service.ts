import { API_URL, getAuthToken } from "@/utils/api.utils";
import {
  UserProfile,
  UserResponse,
  UsersResponse,
  UpdateProfileData,
  UpdatePasswordData,
} from "@/types/user.types";

// Get current user profile
export const getMyProfile = async (): Promise<UserProfile> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const result: UserResponse = await response.json();
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
  return await response.json();
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
  return await response.json();
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
  return await response.json();
};

// Super-Admin: Delete user
export const adminDeleteUser = async (userId: string): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await response.json();
};
