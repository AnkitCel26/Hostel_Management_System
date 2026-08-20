import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import { Pg } from "../../entities/pg.entity.js";
import type { UpdatePgArgs } from "../types/pg.types.ts";

import { Tenant } from "../../entities/tenant.entity.ts";
import { ILike } from "typeorm";

const pgRepo = AppDataSource.getRepository(Pg);

const tenantRepo = AppDataSource.getRepository(Tenant);

export const createPg = async (
  name: string,
  address: string,
  city: string,
  state: string,
  pincode: string,
  contactNo: string,
  description: string,
) => {
  try {
    if (!name || !address || !city || !state || !pincode || !contactNo) {
      throw new GraphQLError("All fields are required");
    }

    const pg = pgRepo.create({
      name: name,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      description: description,
      contactNo: contactNo,
    });

    const savedPg = await pgRepo.save(pg);

    return {
      message: "PG created successfully",
      pg: savedPg,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to create Pg: ${error.message}`);
    }
    throw new GraphQLError("Server Error");
  }
};

export const updatePg = async (pgId: string, data: UpdatePgArgs) => {
  try {
    const input = data.input;

    const fields = Object.entries(input).filter(
      ([_, value]) => value !== undefined,
    );

    if (fields.length === 0) {
      throw new GraphQLError("At least one field is required");
    }

    if (input.contactNo && !/^\d{10}$/.test(input.contactNo)) {
      throw new GraphQLError("Phone number must contain exactly 10 digits");
    }

    const pg = await pgRepo.findOne({
      where: {
        id: pgId,
      },
    });

    if (!pg) {
      throw new GraphQLError("Pg not found");
    }

    Object.assign(pg, input);

    const updatedPg = await pgRepo.save(pg);

    return {
      message: "Pg data updated successfully",
      pg: updatedPg,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to update Pg: ${error.message}`);
    }
    throw new GraphQLError("Server Error");
  }
};

export const getAllPgsRooms = async (input?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const page = Math.max(input?.page ?? 1, 1);
    const limit = Math.min(Math.max(input?.limit ?? 10, 1), 100);
    const skip = (page - 1) * limit;

    const search = input?.search?.trim();
    const [pgs, total] = await pgRepo.findAndCount({
      relations: {
        rooms: true,
      },

      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        contactNo: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,

        rooms: {
          id: true,
          pgId: true,
          roomNo: true,
          floor: true,
          capacity: true,
          occupiedNo: true,
          monthlyRent: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      where: search
        ? {
            name: ILike(`%${search}%`),
          }
        : {},

      order: {
        createdAt: "DESC",
      },
    });

    return {
      items: pgs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new GraphQLError("Failed to fetch all PG and room");
  }
};

export const getTenantPgRoom = async (userId: string) => {
  try {
    if (!userId) {
      throw new GraphQLError("User ID is required");
    }

    const tenant = await tenantRepo.findOne({
      where: {
        userId,
      },
      relations: {
        pg: true,
        room: true,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    if (!tenant.pg) {
      throw new GraphQLError("PG not assigned");
    }

    if (!tenant.room) {
      throw new GraphQLError("Room not assigned");
    }

    return {
      message: "Tenant PG and room fetched successfully",
      tenant,
      pg: tenant.pg,
      room: tenant.room,
    };
  } catch (error) {
    throw new GraphQLError("Failed to fetch tenant PG and room");
  }
};

export const getAllPgs = async () => {
  try {
    const Pgs = await pgRepo.find({
      select: {
        id: true,
        name: true,
        isActive: true,
        city: true,
        state: true,
      },
      relations: {
        rooms: true,
      },
    });
    return Pgs;
  } catch (error) {
    throw new GraphQLError("Failed to fetch all pgs");
  }
};
