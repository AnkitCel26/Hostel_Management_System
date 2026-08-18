import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetAdminRentSummaryResponse,
  GetAdminRentSummaryVariables,
  GetAllRentPaymentsResponse,
  GetAllRentPaymentsVariables,
  UpdateRentPaymentResponse,
  UpdateRentPaymentVariables,
} from "../types/PaymentManagement.types";

export const GET_ADMIN_RENT_SUMMARY: TypedDocumentNode<
  GetAdminRentSummaryResponse,
  GetAdminRentSummaryVariables
> = gql`
  query GetAdminRentSummary(
    $month: String!
    $year: Int!
    $page: Int!
    $limit: Int!
  ) {
    getAdminRentSummary(
      month: $month
      year: $year
      page: $page
      limit: $limit
    ) {
      items {
        pgId
        pgName
        totalRooms
        occupiedRooms
        totalRent
        paidRent
        dueRent
      }

      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ALL_RENT_PAYMENTS: TypedDocumentNode<
  GetAllRentPaymentsResponse,
  GetAllRentPaymentsVariables
> = gql`
  query GetAllRentPayments(
    $page: Int!
    $limit: Int!
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    getAllRentPayments(
      page: $page
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      items {
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

        tenant {
          id

          user {
            id
            name
            email
            phone
          }

          pg {
            id
            name
          }

          room {
            id
            roomNo
          }
        }
      }

      total
      page
      limit
      totalPages
    }
  }
`;

export const UPDATE_RENT_PAYMENT: TypedDocumentNode<
  UpdateRentPaymentResponse,
  UpdateRentPaymentVariables
> = gql`
  mutation UpdateRentPayment($paymentId: ID!, $input: UpdateRentPaymentInput!) {
    updateRentPayment(paymentId: $paymentId, input: $input) {
      message

      payment {
        id
        tenantId
        month
        year
        amount
        paidAmount
        dueDate
        paymentDate
        paymentMode
        status
      }
    }
  }
`;
