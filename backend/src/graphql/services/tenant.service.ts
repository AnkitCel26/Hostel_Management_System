import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import { Tenant, TenantStatus } from "../../entities/tenant.entity.js";
import { User } from "../../entities/user.entity.js";
import { Pg } from "../../entities/pg.entity.js";
import { Room, RoomStatus } from "../../entities/room.entity.js";
import { RentPayment } from "../../entities/rent_payment.entity.ts";

const tenantRepo = AppDataSource.getRepository(Tenant);

export const createTenant = async (
  userId: string,
  pgId: string,
  roomId: string | undefined,
  joiningDate: string,
) => {
  try {
    if (!userId || !pgId || !joiningDate) {
      throw new GraphQLError("All fields are required");
    }

    const actualDate = new Date(joiningDate);

    if (Number.isNaN(actualDate.getTime())) {
      throw new GraphQLError("Invalid joining date");
    }

    return AppDataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new GraphQLError("User not found");
      }

      if (!user.isActive) {
        throw new GraphQLError("User account is inactive");
      }

      const existingTenant = await manager.findOne(Tenant, {
        where: {
          userId,
        },
      });

      if (existingTenant) {
        throw new GraphQLError("User is already registered as a tenant");
      }

      const pg = await manager.findOne(Pg, {
        where: {
          id: pgId,
        },
      });

      if (!pg) {
        throw new GraphQLError("PG not found");
      }

      let room: Room | null = null;

      if (roomId) {
        room = await manager.findOne(Room, {
          where: {
            id: roomId,
          },
        });

        if (!room) {
          throw new GraphQLError("Room not found");
        }

        if (room.pgId !== pgId) {
          throw new GraphQLError("Room does not belong to this PG");
        }

        if (room.occupiedNo >= room.capacity) {
          throw new GraphQLError("Room is already full");
        }

        room.occupiedNo += 1;

        if (room.occupiedNo >= room.capacity) {
          room.status = RoomStatus.FULL;
        } else {
          room.status = RoomStatus.AVAILABLE;
        }

        await manager.save(Room, room);
      }

      const tenant = manager.create(Tenant, {
        userId,
        pgId,
        roomId: roomId ?? null,
        joiningDate: actualDate,
      });

      const savedTenant = await manager.save(Tenant, tenant);

      return {
        message: "Tenant created successfully",
        tenant: savedTenant,
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to create Tenant: ${error.message}`);
    }
    throw new GraphQLError("Server Error");
  }
};

export const updateTenant = async (
  tenantId: string,
  joiningDate?: string,
  status?: TenantStatus,
  roomId?: string,
) => {
  try {
    if (!tenantId) {
      throw new GraphQLError("Tenant ID is required");
    }

    return AppDataSource.transaction(async (manager) => {
      const tenant = await manager.findOne(Tenant, {
        where: { id: tenantId },
      });

      if (!tenant) {
        throw new GraphQLError("Tenant not found");
      }

      if (joiningDate) {
        const date = new Date(joiningDate);

        if (Number.isNaN(date.getTime())) {
          throw new GraphQLError("Invalid joining date");
        }

        tenant.joiningDate = date;
      }

      if (status) {
        tenant.status = status;
      }

      if (roomId && roomId !== tenant.roomId) {
        const room = await manager.findOne(Room, {
          where: { id: roomId },
        });

        if (!room) {
          throw new GraphQLError("Room not found");
        }

        if (room.pgId !== tenant.pgId) {
          throw new GraphQLError("Room does not belong to this PG");
        }

        if (room.occupiedNo >= room.capacity) {
          throw new GraphQLError("Room is full");
        }

        if (tenant.roomId) {
          const prevRoom = await manager.findOne(Room, {
            where: { id: tenant.roomId },
          });

          if (prevRoom) {
            prevRoom.occupiedNo -= 1;
            prevRoom.status = RoomStatus.AVAILABLE;

            await manager.save(prevRoom);
          }
        }

        room.occupiedNo += 1;

        room.status =
          room.occupiedNo >= room.capacity
            ? RoomStatus.FULL
            : RoomStatus.AVAILABLE;

        await manager.save(room);

        tenant.roomId = roomId;
      }

      const updatedTenant = await manager.save(tenant);

      return {
        message: "Tenant updated successfully",
        tenant: updatedTenant,
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new GraphQLError(`Failed to update Tenant: ${error.message}`);
    }
    throw new GraphQLError("Server Error");
  }
};

export const getAllTenants = async (page: number = 1, limit: number = 10) => {
  try {
    const [items, total] = await tenantRepo.findAndCount({
      relations: {
        user: true,
        pg: true,
        room: true,
      },
      order: {
        joiningDate: "DESC",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Failed to fetch tenants:", error);

    throw new GraphQLError("Failed to fetch tenants");
  }
};

export const getRentPaymentHistory = async (userId: string) => {
  try {
    const tenant = await tenantRepo.findOne({
      where: {
        userId,
      },
      relations: {
        room: true,
        rentPayments: true,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    if (!tenant.room) {
      throw new GraphQLError("Room not assigned to tenant");
    }

    return {
      message: "Rent and payment history fetched successfully",
      monthlyRent: Number(tenant.room.monthlyRent),
      paymentHistory: tenant.rentPayments,
    };
  } catch (error) {
    throw new GraphQLError("Failed to fetch rent payment history");
  }
};
