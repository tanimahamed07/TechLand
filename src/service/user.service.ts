import { UserProfile, UserResponse } from "@/types/user.types";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    zip?: string;
  };
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// ২. নিজের প্রোফাইল ডাটা দেখা
export const getMyProfile = async (): Promise<UserProfile> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const result: UserResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to fetch profile");
  return result.data;
};

// ৪. প্রোফাইল আপডেট করা
export const updateMyProfile = async (
  data: UpdateProfileData,
): Promise<UserProfile> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: UserResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update profile");
  return result.data;
};

// ৫. পাসওয়ার্ড পরিবর্তন করা
export const updatePassword = async (
  data: UpdatePasswordData,
): Promise<UserProfile> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: UserResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to update password");
  return result.data;
};
