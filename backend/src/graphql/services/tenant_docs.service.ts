import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import {
  TenantDocument,
  DocumentType,
} from "../../entities/tenant_docs.entity.js";
import { Tenant } from "../../entities/tenant.entity.js";

const tenantDocRepo = AppDataSource.getRepository(TenantDocument);
const tenantRepo = AppDataSource.getRepository(Tenant);

export const uploadTenantDocs = async (
  userId: string,
  documentType: DocumentType,
  fileUrl: string,
) => {
  try {
    if (!documentType || !fileUrl) {
      throw new GraphQLError("All fields are required");
    }

    const tenant = await AppDataSource.getRepository(Tenant).findOne({
      where: {
        userId: userId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const document = tenantDocRepo.create({
      tenantId: tenant.id,
      documentType,
      fileUrl,
    });

    const savedDocument = await tenantDocRepo.save(document);

    return {
      message: "Document uploaded successfully",
      document: savedDocument,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to upload document: ${error.message}`);
    }
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
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to update document: ${error.message}`);
    }
    throw new GraphQLError("Failed to update document");
  }
};

export const getTenantDocuments = async (userId: string) => {
  try {
    const tenant = await tenantRepo.findOne({
      where: {
        userId: userId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const tenantDoc = await tenantDocRepo.find({
      where: {
        tenantId: tenant.id,
      },
    });
    return tenantDoc;
  } catch (error) {
    throw new GraphQLError("Failed to fetch document");
  }
};

export const deleteTenantDocuments = async (documentId: string) => {
  try {
    const document = await tenantDocRepo.findOne({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new GraphQLError("Document not found");
    }

    await tenantDocRepo.remove(document);

    return {
      message: "Document deleted successfully",
    };
  } catch (error) {
    throw new GraphQLError("Failed to Delete document");
  }
};
