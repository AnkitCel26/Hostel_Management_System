import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import {
  TenantDocument,
  DocumentType,
} from "../../entities/tenant_docs.entity.js";
import { Tenant } from "../../entities/tenant.entity.js";

const tenantDocRepo = AppDataSource.getRepository(TenantDocument);

export const uploadTenantDocs = async (
  tenantId: string,
  documentType: DocumentType,
  fileUrl: string,
) => {
  try {
    if (!tenantId || !documentType || !fileUrl) {
      throw new GraphQLError("All fields are required");
    }

    const tenant = await AppDataSource.getRepository(Tenant).findOne({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const document = tenantDocRepo.create({
      tenantId,
      documentType,
      fileUrl,
    });

    const savedDocument = await tenantDocRepo.save(document);

    return {
      message: "Document uploaded successfully",
      document: savedDocument,
    };
  } catch (error) {
    throw new GraphQLError("Failed to upload document");
  }
};

export const updateTenantDocs = async (
  documentId: string,
  documentType?: DocumentType,
  fileUrl?: string,
) => {
  try {
    if (!documentId) {
      throw new GraphQLError("Document ID is required");
    }

    if (!documentType && !fileUrl) {
      throw new GraphQLError("Nothing to update");
    }

    const document = await tenantDocRepo.findOne({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new GraphQLError("Document not found");
    }

    const tenant = await AppDataSource.getRepository(Tenant).findOne({
      where: {
        id: document.tenantId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    if (documentType) {
      document.documentType = documentType;
    }

    if (fileUrl) {
      document.fileUrl = fileUrl;
    }

    const updatedDocument = await tenantDocRepo.save(document);

    return {
      message: "Document updated successfully",
      document: updatedDocument,
    };
  } catch (error) {
    throw new GraphQLError("Failed to update document");
  }
};