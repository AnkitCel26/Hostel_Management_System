import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

import type {
  CreateComplaintData,
  CreateComplaintVariables,
  GetTenantComplaintsData,
} from "../types/TenantComplaint.types";

export const GET_TENANT_COMPLAINTS: TypedDocumentNode<
  GetTenantComplaintsData
> = gql`
  query GetTenantComplaints {
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
  }
`;

export const CREATE_COMPLAINT: TypedDocumentNode<
  CreateComplaintData,
  CreateComplaintVariables
> = gql`
  mutation CreateComplaint(
    $input: CreateComplaintInput!
  ) {
    createComplaint(input: $input) {
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