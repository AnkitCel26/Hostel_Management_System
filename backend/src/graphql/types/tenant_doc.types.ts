import type { DocumentType } from "../../entities/tenant_docs.entity.js";

export interface UploadTenantDocArgs {
  input: {
    tenantId: string;
    documentType: DocumentType;
    fileUrl: string;
  };
}

export interface UpdateTenantDocArgs {
  documentId: string;
  input: {
    documentType?: DocumentType;
    fileUrl?: string;
  };
}