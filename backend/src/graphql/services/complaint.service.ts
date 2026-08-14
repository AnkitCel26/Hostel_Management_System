import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import { Complaint, ComplaintStatus } from "../../entities/complaint.entity.ts";
import { Tenant } from "../../entities/tenant.entity.ts";

const complaintRepo = AppDataSource.getRepository(Complaint); 
const tenantRepo = AppDataSource.getRepository(Tenant);

export const createComplaint = async (
  tenantId: string,
  title: string,
  description: string,
  documentUrl?: string,
) => {
  try {
    if (!tenantId || !title || !description) {
      throw new GraphQLError("All fields are required");
    }

    const tenant = await tenantRepo.findOne({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const complaint = complaintRepo.create({
      tenantId,
      pgId: tenant.pgId,
      title,
      description,
      documentUrl: documentUrl ?? null,
      resolvedAt: null,
    });

    const savedComplaint = await complaintRepo.save(complaint);

    return {
      message: "Complaint created successfully",
      complaint: savedComplaint,
    };
  } catch (error) {
    throw new GraphQLError("Failed to create complaint");
  }
};

export const updateComplaint = async (
  complaintId: string,
  status: ComplaintStatus,
) => {
  try {
    if (!complaintId || !status) {
      throw new GraphQLError("Complaint ID and status are required");
    }

    const complaint = await complaintRepo.findOne({
      where: {
        id: complaintId,
      },
    });

    if (!complaint) {
      throw new GraphQLError("Complaint not found");
    }

    complaint.status = status;

    if (status === ComplaintStatus.RESOLVED) {
      complaint.resolvedAt = new Date();
    }

    if (
      status === ComplaintStatus.OPEN ||
      status === ComplaintStatus.IN_PROGRESS
    ) {
      complaint.resolvedAt = null;
    }

    const updatedComplaint = await complaintRepo.save(complaint);

    return {
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    };
  } catch (error) {
    throw new GraphQLError("Failed to update complaint");
  }
};

export const getTenantComplaints = async (userId: string) => {
  try {
    const tenant = await tenantRepo.findOne({
      where: {
        userId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const complaints = await complaintRepo.find({
      where: {
        tenantId: tenant.id,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return complaints;
  } catch (error) {

    throw new GraphQLError("Failed to fetch complaints");
  }
};