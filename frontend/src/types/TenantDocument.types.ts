export type Document = "aadhaar" | "pan";

export interface TenantDocument {
  id: string;
  tenantId: string;
  documentType: Document;
  fileUrl: string;
  createdAt: string;

}

export interface uploadTenantDocsInput {
  documentType: Document;
  fileUrl: string;
}

export interface uploadTenantDocsResponse {
  uploadTenantDocs: {
    message: string;
    document: TenantDocument;
  };
}

export interface GetTenantDocumentsResponse {
  getTenantDocuments: TenantDocument[];
}

export interface DeleteDocumentResponse {
  deleteTenantDocuments: {
    message: string;
  };
}

export interface DeleteDocumentVariables {
  documentId: string;
}