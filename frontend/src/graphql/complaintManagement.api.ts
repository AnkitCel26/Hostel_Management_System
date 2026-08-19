import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type {
  GetAllComplaintsQuery,
  GetAllComplaintsQueryVariables,
  UpdateComplaintMutation,
  UpdateComplaintMutationVariables,
} from "../types/ComplaintManagement.types";

export const GET_ALL_COMPLAINTS: TypedDocumentNode<
  GetAllComplaintsQuery,
  GetAllComplaintsQueryVariables
> = gql`
  query GetAllComplaints(
    $page: Int!
    $limit: Int!
    $search: String
    $status: ComplaintStatus
  ) {
    getAllComplaints(
      page: $page
      limit: $limit
      search: $search
      status: $status
    ) {
      items {
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
        tenant {
          id
          user {
            id
            name
            email
            role
            phone
            isActive
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
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const UPDATE_COMPLAINT: TypedDocumentNode<
  UpdateComplaintMutation,
  UpdateComplaintMutationVariables
> = gql`
  mutation UpdateComplaint(
    $complaintId: ID!
    $input: UpdateComplaintInput!
  ) {
    updateComplaint(
      complaintId: $complaintId
      input: $input
    ) {
      message
      complaint {
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
    }
  }
`;