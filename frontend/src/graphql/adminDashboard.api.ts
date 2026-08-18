import { gql, type TypedDocumentNode } from "@apollo/client";
import type { DashboardResponse } from "../types/adminDashboard.types";

export const ADMIN_DASHBOARD: TypedDocumentNode<DashboardResponse> = gql`
  query GetAdminDashboard {
    getAdminDashboardStats {
      totalPgs
      activePgs
      totalRooms
      totalTenants
      occupiedBeds
      availableBeds
      fullRooms
      availableRooms
    }
  }
`;