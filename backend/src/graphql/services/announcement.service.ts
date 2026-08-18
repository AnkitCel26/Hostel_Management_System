import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import { Announcement } from "../../entities/announcement.entity.ts";
import { Tenant } from "../../entities/tenant.entity.ts";

const announcementRepo = AppDataSource.getRepository(Announcement);
const tenantRepo = AppDataSource.getRepository(Tenant);

export const createAnnouncement = async (
  pgId: string,
  userId: string,
  title: string,
  content: string,
) => {
  if (!userId || !pgId) {
    throw new GraphQLError("Unauthorized");
  }

  if (!title || !content) {
    throw new GraphQLError("Title and content are required");
  }

  return AppDataSource.transaction(async (manager) => {
    const announcementRepo =
      manager.getRepository(Announcement);

    const announcement = announcementRepo.create({
      pgId,
      createdBy: userId,
      title,
      content,
    });

    const savedAnnouncement =
      await announcementRepo.save(announcement);

    const announcementWithPg =
      await announcementRepo.findOne({
        where: {
          id: savedAnnouncement.id,
        },
        relations: {
          pg: true,
        },
      });

    if (!announcementWithPg) {
      throw new GraphQLError("Announcement not found");
    }

    return {
      message: "Announcement created successfully",
      announcement: announcementWithPg,
    };
  });
};

export const updateAnnouncement = async (
  announcementId: string,
  isActive: boolean,
) => {
  try {
    if (!announcementId || isActive === undefined) {
      throw new GraphQLError(
        "Announcement ID and status are required",
      );
    }

    return await AppDataSource.transaction(async (manager) => {
      const announcementRepo =
        manager.getRepository(Announcement);

      const announcement = await announcementRepo.findOne({
        where: {
          id: announcementId,
        },
      });

      if (!announcement) {
        throw new GraphQLError("Announcement not found");
      }

      announcement.isActive = isActive;

      const updatedAnnouncement =
        await announcementRepo.save(announcement);

      const announcementWithPg =
        await announcementRepo.findOne({
          where: {
            id: updatedAnnouncement.id,
          },
          relations: {
            pg: true,
          },
        });

      if (!announcementWithPg) {
        throw new GraphQLError("Announcement not found");
      }

      return {
        message: "Announcement updated successfully",
        announcement: announcementWithPg,
      };
    });
  } catch (error) {
    throw new GraphQLError(
      "Failed to update announcement",
    );
  }
};

export const getTenantPgAnnouncements = async (userId: string) => {
  try {
    const tenant = await tenantRepo.findOne({
      where: {
        userId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const announcements = await announcementRepo.find({
      where: {
        pgId: tenant.pgId,
        isActive: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return announcements;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to fetch PG announcements");
  }
};

export const getAllAnnouncements = async () => {
  try {
    const announcements = await announcementRepo.find({
      relations: {
        pg: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return announcements;
  } catch (error) {
    throw new GraphQLError("Failed to fetch announcements");
  }
};
