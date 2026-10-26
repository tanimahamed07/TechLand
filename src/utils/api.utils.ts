import { getSession } from "next-auth/react";

// Base API URL
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Get auth token for authenticated operations
export const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }
  return session.accessToken as string;
};
