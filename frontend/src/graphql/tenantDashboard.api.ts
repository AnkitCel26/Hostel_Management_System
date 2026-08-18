import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetTenantDashboardQuery,
  GetTenantDashboardQueryVariables,
} from "../types/TenantDashboard.types";

export const GET_TENANT_DASHBOARD: TypedDocumentNode<
  GetTenantDashboardQuery,
  GetTenantDashboardQueryVariables
> = gql`
  query GetTenantDashboard($userId: ID!) {
    getTenantPgRoom(userId: $userId) {
      message
      tenant {
        id
        userId
        pgId
        roomId
        joiningDate
        status
        createdAt
        updatedAt
      }
      pg {
        id
        name
        address
        city
        state
        pincode
        contactNo
        description
        isActive
        createdAt
        updatedAt
      }
      room {
        id
        pgId
        roomNo
        floor
        capacity
        occupiedNo
        monthlyRent
        status
        createdAt
        updatedAt
      }
    }

    getRentPaymentHistory(userId: $userId) {
      message
      monthlyRent
      paymentHistory {
        id
        tenantId
        month
        year
        amount
        paidAmount
        dueDate
        paymentDate
        paymentMode
        receiptUrl
        status
        createdAt
        updatedAt
      }
    }

    getTenantComplaints {
      id
      tenantId
      pgId
      title
      description
      status
      documentUrl
      createdAt
      updatedAt
      resolvedAt
    }

    getTenantPgAnnouncements {
      id
      pgId
      createdBy
      title
      content
      isActive
      createdAt
      updatedAt
    }
  }
`;