import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import { Pg } from "../../entities/pg.entity.js";
import type { UpdatePgArgs } from "../types/pg.types.ts";
import { User } from "../../entities/user.entity.ts";
import { Tenant } from "../../entities/tenant.entity.ts";

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
  if (!name || !address || !city || !state || !pincode || !contactNo) {
    throw new GraphQLError("All fields are required");
  }
  try {
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
    throw new GraphQLError("Server Error");
  }
};

export const updatePg = async (pgId: string, data: UpdatePgArgs) => {
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

  try {
    Object.assign(pg, input);

    const updatedPg = await pgRepo.save(pg);

    return {
      message: "Pg data updated successfully",
      pg: updatedPg,
    };
  } catch (error) {
    throw new GraphQLError("Server Error");
  }
};

export const getAllPgsRooms = async () => {
  const pgs = await pgRepo.find({
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

      rooms: {
        id: true,
        pgId: true,
        roomNo: true,
        floor: true,
        capacity: true,
        occupiedNo: true,
        monthlyRent: true,
        status: true,
      },
    },
  });
  return pgs;
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
