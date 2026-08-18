import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type {
  GetAllComplaintsQuery,
  UpdateComplaintMutation,
  UpdateComplaintMutationVariables,
} from "../types/ComplaintManagement.types";

export const GET_ALL_COMPLAINTS: TypedDocumentNode<
  GetAllComplaintsQuery
> = gql`
  query GetAllComplaints {
    getAllComplaints {
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