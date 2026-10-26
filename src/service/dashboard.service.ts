import { API_URL, getAuthToken } from "@/utils/api.utils";
import {
  DashboardOverview,
  DashboardOverviewResponse,
} from "@/types/dashboard.types";

// Get dashboard overview statistics
export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/v1/dashboard/overview`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result: DashboardOverviewResponse = await response.json();

  return result.data;
};
