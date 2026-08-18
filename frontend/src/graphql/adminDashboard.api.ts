import { gql, type TypedDocumentNode } from "@apollo/client";
import type { DashboardResponse } from "../types/adminDashboard.types";

export const ADMIN_DASHBOARD: TypedDocumentNode<DashboardResponse> = gql`
  query GetAdminDashboard {
    allUsers {
      id
      name
      email
      role
      phone
      isActive
    }

    getAllPgsRooms {
      id
      name
      address
      city
      state
      pincode
      contactNo
      description
      isActive

      rooms {
        id
        pgId
        roomNo
        floor
        capacity
        occupiedNo
        monthlyRent
        status
      }
    }
  }
`;
