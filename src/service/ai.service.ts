import { getSession } from "next-auth/react";
import {
  GenerateDescriptionPayload,
  GenerateDescriptionResponse,
  GenerateTagsPayload,
  GenerateTagsResponse,
  ChatPayload,
  ChatResponse,
} from "@/types/service.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Get auth token for AI operations
const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

// Generate product description using AI
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

// Generate product tags using AI
export const generateTags = async (
  payload: GenerateTagsPayload,
): Promise<GenerateTagsResponse> => {
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

// Chat with AI assistant
export const chatWithAssistant = async (
  payload: ChatPayload,
): Promise<ChatResponse> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ChatResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get AI response");
  }

  return result;
};
