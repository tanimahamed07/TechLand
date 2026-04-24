import { getSession } from "next-auth/react";
import {
  DashboardOverview,
  DashboardOverviewResponse,
} from "@/types/dashboard.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Get auth token for dashboard operations
const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken as string;
};

// Get dashboard overview statistics
export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/dashboard/overview`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result: DashboardOverviewResponse = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to fetch dashboard overview");

  return result.data;
};
