export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  title: string;
  price: number;
  sold: number;
  images: string[];
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

export interface DashboardOverview {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalCategories: number;
  totalReviews: number;
  totalRevenue: number;
  orderStatusMap: Record<string, number>;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  monthlyData: MonthlyData[];
}

export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: DashboardOverview;
}
