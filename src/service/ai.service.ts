import { API_URL, getAuthToken } from "@/utils/api.utils";
import {
  GenerateDescriptionPayload,
  GenerateDescriptionResponse,
  GenerateTagsPayload,
  GenerateTagsResponse,
  ChatPayload,
  ChatResponse,
} from "@/types/service.types";


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
  return await response.json();
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
  return await response.json();
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

  return await response.json();
};
