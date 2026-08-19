import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import { Room } from "../../entities/room.entity.ts";
import type { CreateRoomArgs, UpdateRoomArgs } from "../types/room.types.ts";

const roomRepo = AppDataSource.getRepository(Room);

export const createRoom = async (data: CreateRoomArgs) => {
  try {
    const input = data.input;
    if (
      !input.pgId ||
      !input.roomNo ||
      !input.floor ||
      !input.capacity ||
      !String(input.occupiedNo) ||
      !input.monthlyRent
    ) {
      throw new GraphQLError("All fields are required");
    }
    const room = roomRepo.create({
      pgId: input.pgId,
      roomNo: input.roomNo,
      floor: input.floor,
      capacity: input.capacity,
      occupiedNo: input.occupiedNo,
      monthlyRent: input.monthlyRent,
    });

    const savedRoom = await roomRepo.save(room);

    return {
      message: "Room created successfully",
      room: savedRoom,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to create Room: ${error.message}`);
    }
    throw new GraphQLError("Server Error");
  }
};

export const updateRoom = async (roomId: string, data: UpdateRoomArgs) => {
  try {
    const input = data.input;

    const fields = Object.entries(input).filter(
      ([_, value]) => value !== undefined,
    );

    if (fields.length === 0) {
      throw new GraphQLError("At least one field is required");
    }

    const room = await roomRepo.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new GraphQLError("Room not found");
    }

    Object.assign(room, input);

    const updatedRoom = await roomRepo.save(room);

    return {
      message: "Room data updated successfully",
      room: updatedRoom,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to update Pg: ${error.message}`);
    }
    throw new GraphQLError("Server Error");
  }
};

export const getAllRooms = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  const query = roomRepo
    .createQueryBuilder("room")
    .leftJoinAndSelect("room.pg", "pg");

  if (search) {
    query.where(
      "CAST(room.roomNo AS TEXT) ILIKE :search OR pg.name ILIKE :search",
      {
        search: `%${search}%`,
      },
    );
  }

  query
    .orderBy("room.createdAt", "DESC")
    .skip((page - 1) * limit)
    .take(limit);

  const [items, total] = await query.getManyAndCount();

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
