import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import { Complaint, ComplaintStatus } from "../../entities/complaint.entity.ts";
import { Tenant } from "../../entities/tenant.entity.ts";

const complaintRepo = AppDataSource.getRepository(Complaint);
const tenantRepo = AppDataSource.getRepository(Tenant);

export const createComplaint = async (
  userId: string,
  title: string,
  description: string,
  documentUrl?: string,
) => {
  try {
    if (!userId || !title || !description) {
      throw new GraphQLError("All fields are required");
    }

    const tenant = await tenantRepo.findOne({
      where: {
        userId: userId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const complaint = complaintRepo.create({
      tenantId: tenant.id,
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
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to create complaint: ${error.message}`);
    }
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
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to update complaint: ${error.message}`);
    }
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

export const getAllComplaints = async (
  page: number,
  limit: number,
  search?: string,
  status?: ComplaintStatus,
) => {
  try {
    const query = complaintRepo
      .createQueryBuilder("complaint")
      .leftJoinAndSelect("complaint.tenant", "tenant")
      .leftJoinAndSelect("tenant.user", "user")
      .leftJoinAndSelect("tenant.pg", "pg")
      .leftJoinAndSelect("tenant.room", "room")
      .leftJoinAndSelect("complaint.pg", "complaintPg")
      .orderBy("complaint.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (search?.trim()) {
      query.where(
        `(
          user.name ILIKE :search
          OR pg.name ILIKE :search
          OR CAST(room.roomNo AS TEXT) ILIKE :search
          OR complaint.title ILIKE :search
          OR complaint.description ILIKE :search
        )`,
        {
          search: `%${search.trim()}%`,
        },
      );
    }
    if (status) {
      query.andWhere("complaint.status = :status", { status });
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new GraphQLError("Failed to fetch complaints");
  }
};
