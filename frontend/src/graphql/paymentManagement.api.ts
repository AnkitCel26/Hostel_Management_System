import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
    GetAdminRentSummaryResponse,
  GetAdminRentSummaryVariables,
  GetAllRentPaymentsResponse,
  UpdateRentPaymentResponse,
  UpdateRentPaymentVariables,
} from "../types/PaymentManagement.types";


export const GET_ADMIN_RENT_SUMMARY: TypedDocumentNode<
  GetAdminRentSummaryResponse,
  GetAdminRentSummaryVariables
> = gql`
  query GetAdminRentSummary($month: String!, $year: Int!) {
    getAdminRentSummary(month: $month, year: $year) {
      pgId
      pgName
      totalRooms
      occupiedRooms
      totalRent
      paidRent
      dueRent
    }
  }
`;

export const GET_ALL_RENT_PAYMENTS: TypedDocumentNode<
  GetAllRentPaymentsResponse
> = gql`
  query GetAllRentPayments {
    getAllRentPayments {
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
  }
`;

export const UPDATE_RENT_PAYMENT: TypedDocumentNode<
  UpdateRentPaymentResponse,
  UpdateRentPaymentVariables
> = gql`
  mutation UpdateRentPayment(
    $paymentId: ID!
    $input: UpdateRentPaymentInput!
  ) {
    updateRentPayment(
      paymentId: $paymentId
      input: $input
    ) {
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

