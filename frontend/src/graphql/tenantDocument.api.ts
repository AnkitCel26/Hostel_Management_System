import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type {
  DeleteDocumentResponse,
    DeleteDocumentVariables,
    GetTenantDocumentsResponse,
  uploadTenantDocsInput,
  uploadTenantDocsResponse,
} from "../types/TenantDocument.types";

export const UPLOAD_DOCUMENT: TypedDocumentNode<
  uploadTenantDocsResponse,
  { input: uploadTenantDocsInput }
> = gql`
  mutation ($input: uploadTenantDocsInput!) {
    uploadTenantDocs(input: $input) {
      message
      document {
        id
        tenantId
        documentType
        fileUrl
        createdAt

      }
    }
  }
`;

export const GET_TENANT_DOCUMENTS: TypedDocumentNode<
  GetTenantDocumentsResponse
> = gql`
  query GetTenantDocuments {
    getTenantDocuments {
      id
      tenantId
      documentType
      fileUrl
      createdAt
    }
  }
`;

export const DELETE_TENANT_DOCUMENT: TypedDocumentNode<
  DeleteDocumentResponse,
  DeleteDocumentVariables
> = gql`
  mutation DeleteTenantDocument($documentId: ID!) {
    deleteTenantDocuments(documentId: $documentId) {
      message
    }
  }
`;
