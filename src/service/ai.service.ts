import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

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

export interface GenerateTagsResponse {
  success: boolean;
  message: string;
  data: { tags: string[] };
}

// AI: Product description generate করা
export const generateDescription = async (
  payload: GenerateDescriptionPayload,
): Promise<GenerateDescriptionResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/ai/generate-description`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result: GenerateDescriptionResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to generate description");
  return result;
};

// AI: Product tags generate করা
export const generateTags = async (payload: {
  title: string;
  category: string;
}): Promise<GenerateTagsResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/ai/generate-tags`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result: GenerateTagsResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to generate tags");
  return result;
};
