export interface DashboardStats {
  totalPgs: number;
  activePgs: number;
  totalRooms: number;
  totalTenants: number;
  occupiedBeds: number;
  availableBeds: number;
  fullRooms: number;
  availableRooms: number;
}

export interface DashboardResponse {
  getAdminDashboardStats: DashboardStats;
}