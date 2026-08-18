import { GraphQLError } from "graphql";

import {
  allUsers,
  loginUser,
  logoutUser,
  me,
  registerUser,
  updateProfile,
} from "./services/user.service.ts";
import type {
  LoginUserArgs,
  RegisterUserArgs,
  UpdateProfileArgs,
} from "./types/user.types.ts";

import type { CreatePgArgs, UpdatePgArgs } from "./types/pg.types.ts";
import {
  createPg,
  getAllPgsRooms,
  getTenantPgRoom,
  updatePg,
} from "./services/pg.service.ts";
import { createRoom, updateRoom } from "./services/room.service.ts";
import type { CreateRoomArgs, UpdateRoomArgs } from "./types/room.types.ts";
import {
  createTenant,
  getAllTenants,
  getRentPaymentHistory,
  updateTenant,
} from "./services/tenant.service.ts";
import type {
  CreateTenantArgs,
  UpdateTenantArgs,
} from "./types/tenant.types.ts";
import {
  updateTenantDocs,
  uploadTenantDocs,
} from "./services/tenant_docs.service.ts";
import type {
  UpdateTenantDocArgs,
  UploadTenantDocArgs,
} from "./types/tenant_doc.types.ts";
import {
  createRentPayment,
  getAdminRentSummary,
  getAllRentPayments,
  updateRentPayment,
} from "./services/rent_payment.service.ts";
import type {
  CreateRentPaymentArgs,
  UpdateRentPaymentArgs,
} from "./types/rentPayment.types.ts";
import {
  createComplaint,
  getAllComplaints,
  getTenantComplaints,
  updateComplaint,
} from "./services/complaint.service.ts";
import type {
  CreateComplaintArgs,
  UpdateComplaintArgs,
} from "./types/complaint.types.ts";
import {
  createAnnouncement,
  getAllAnnouncements,
  getTenantPgAnnouncements,
  updateAnnouncement,
} from "./services/announcement.service.ts";
import type {
  CreateAnnouncementArgs,
  UpdateAnnouncementArgs,
} from "./types/announcement.types.ts";
import type { GraphQLContext } from "./types/context.types.ts";
import { requireAdmin, requireAuth } from "../authUtility/authmiddleware.ts";
import { refreshAccessToken } from "./services/auth.service.ts";
export const resolvers = {
  Query: {

    me: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAuth(context);
      return me(user.id);
    },

    allUsers: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      try {
        await requireAuth(context);
        return await allUsers();
      } catch (error) {
        throw new GraphQLError("Failed to fetch users");
      }
    },

    getAllPgsRooms: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      try {
        await requireAuth(context);
        return await getAllPgsRooms();
      } catch (error) {
        throw new GraphQLError("Failed to fetch all pgs and rooms");
      }
    },

    getTenantPgRoom: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAuth(context);

      return await getTenantPgRoom(user.id);
    },

    getRentPaymentHistory: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAuth(context);

      return await getRentPaymentHistory(user.id);
    },

    getAllRentPayments: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      return getAllRentPayments();
    },

    getAdminRentSummary: async (
      parent: unknown,
      args: {
        month: string;
        year: number;
      },
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      const { month, year } = args;

      return getAdminRentSummary(month, year);
    },

    getTenantComplaints: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAuth(context);

      return await getTenantComplaints(user.id);
    },

    getAllComplaints: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      return getAllComplaints();
    },

    getTenantPgAnnouncements: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAuth(context);

      return await getTenantPgAnnouncements(user.id);
    },

    getAllAnnouncements: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      return getAllAnnouncements();
    },

    getAllTenants: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      await requireAdmin(context);
      return await getAllTenants();
    },
  },
  Mutation: {
    registerUser: async (
      parent: unknown,
      args: RegisterUserArgs,
      context: unknown,
      info: unknown,
    ) => {
      const { name, email, password, role, phone } = args.input;

      return registerUser(name, email, password, role, phone);
    },

    loginUser: async (
      parent: unknown,
      args: LoginUserArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const { email, password } = args.input;

      return loginUser(email, password, context.res);
    },

    logoutUser: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      return logoutUser(context.res);
    },

    refreshToken: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext,
      info: unknown,
    ) => {
      return refreshAccessToken(context.req, context.res);
    },

    updateProfile: async (
      parent: unknown,
      args: UpdateProfileArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAuth(context);
      const { name, phone } = args.input;

      return updateProfile(user?.id, name, phone);
    },

    createPg: async (
      parent: unknown,
      args: CreatePgArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      const { name, address, city, state, pincode, contactNo, description } =
        args.input;
      return createPg(
        name,
        address,
        city,
        state,
        pincode,
        contactNo,
        description,
      );
    },

    updatePg: async (
      parent: unknown,
      args: UpdatePgArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      const result = await updatePg(args.pgId, args);

      return result;
    },

    createRoom: async (
      parent: unknown,
      args: CreateRoomArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      const result = await createRoom(args);

      return result;
    },

    updateRoom: async (
      parent: unknown,
      args: UpdateRoomArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);
      const result = await updateRoom(args.roomId, args);

      return result;
    },

    createTenant: async (
      parent: unknown,
      args: CreateTenantArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);
      const { userId, pgId, roomId, joiningDate } = args.input;

      return createTenant(userId, pgId, roomId, joiningDate);
    },

    updateTenant: async (
      parent: unknown,
      args: UpdateTenantArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);
      const { tenantId, joiningDate, status, roomId } = args.input;

      return updateTenant(tenantId, joiningDate, status, roomId);
    },

    uploadTenantDocs: async (
      parent: unknown,
      args: UploadTenantDocArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAuth(context);
      const { tenantId, documentType, fileUrl } = args.input;

      return uploadTenantDocs(tenantId, documentType, fileUrl);
    },

    updateTenantDocs: async (
      parent: unknown,
      args: UpdateTenantDocArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAuth(context);
      const { documentId, input } = args;

      return updateTenantDocs(documentId, input.documentType, input.fileUrl);
    },

    createRentPayment: async (
      parent: unknown,
      args: CreateRentPaymentArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAuth(context);
      const {
        tenantId,
        month,
        year,
        amount,
        paidAmount,
        dueDate,
        paymentDate,
        paymentMode,
      } = args.input;

      return createRentPayment(
        tenantId,
        month,
        year,
        amount,
        paidAmount,
        dueDate,
        paymentDate,
        paymentMode,
      );
    },

    updateRentPayment: async (
      parent: unknown,
      args: UpdateRentPaymentArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);
      const { paymentId, input } = args;

      return updateRentPayment(
        paymentId,
        input.paidAmount,
        input.paymentDate,
        input.paymentMode,
      );
    },

    createComplaint: async (
      parent: unknown,
      args: CreateComplaintArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAuth(context);
      const { title, description, documentUrl } = args.input;

      return createComplaint(user.id, title, description, documentUrl);
    },

    updateComplaint: async (
      parent: unknown,
      args: UpdateComplaintArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);
      const { complaintId, input } = args;
      return updateComplaint(complaintId, input.status);
    },

    createAnnouncement: async (
      parent: unknown,
      args: CreateAnnouncementArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      const user = requireAdmin(context);
      const { pgId, title, content } = args.input;

      return createAnnouncement(pgId, user.id, title, content);
    },

    updateAnnouncement: async (
      parent: unknown,
      args: UpdateAnnouncementArgs,
      context: GraphQLContext,
      info: unknown,
    ) => {
      requireAdmin(context);

      const { announcementId, input } = args;
      return updateAnnouncement(announcementId, input.isActive);
    },
  },
};
