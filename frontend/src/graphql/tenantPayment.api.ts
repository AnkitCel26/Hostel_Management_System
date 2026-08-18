import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  CreateRentPaymentMutation,
  CreateRentPaymentMutationVariables,
  GetRentPaymentHistoryQuery,
  GetRentPaymentHistoryQueryVariables,
} from "../types/TenantPayment.types";

export const GET_RENT_PAYMENT_HISTORY: TypedDocumentNode<
  GetRentPaymentHistoryQuery,
  GetRentPaymentHistoryQueryVariables
> = gql`
  query GetRentPaymentHistory($userId: ID!) {
    getTenantPgRoom(userId: $userId) {
      tenant {
        id
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
  }
`;

export const CREATE_RENT_PAYMENT: TypedDocumentNode<
  CreateRentPaymentMutation,
  CreateRentPaymentMutationVariables
> = gql`
  mutation CreateRentPayment($input: CreateRentPaymentInput!) {
    createRentPayment(input: $input) {
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
        receiptUrl
        status
        createdAt
        updatedAt
      }
    }
  }
`;