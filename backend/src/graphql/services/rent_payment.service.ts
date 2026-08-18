import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.js";
import {
  PaymentStatus,
  RentPayment,
  type PaymentMode,
} from "../../entities/rent_payment.entity.ts";
import { Tenant } from "../../entities/tenant.entity.ts";
import { Pg } from "../../entities/pg.entity.ts";

const paymentRepo = AppDataSource.getRepository(RentPayment);
const tenantRepo = AppDataSource.getRepository(Tenant);
const pgRepo = AppDataSource.getRepository(Pg);

export const createRentPayment = async (
  tenantId: string,
  month: string,
  year: number,
  amount: number,
  paidAmount: number,
  dueDate: string,
  paymentDate: string,
  paymentMode: PaymentMode,
) => {
  try {
    if (
      !tenantId ||
      !month ||
      !year ||
      !amount ||
      paidAmount === undefined ||
      !dueDate ||
      !paymentDate ||
      !paymentMode
    ) {
      throw new GraphQLError("All payment fields are required");
    }

    if (amount <= 0 || paidAmount <= 0) {
      throw new GraphQLError("Amount and paid amount must be greater than 0");
    }

    if (paidAmount > amount) {
      throw new GraphQLError("Paid amount cannot be greater than rent amount");
    }

    const tenant = await tenantRepo.findOne({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      throw new GraphQLError("Tenant not found");
    }

    const existingPayment = await paymentRepo.findOne({
      where: {
        tenantId,
        month,
        year,
      },
    });

    if (existingPayment) {
      throw new GraphQLError("Payment for this month already exists");
    }

    const due = new Date(dueDate);
    const paid = new Date(paymentDate);

    if (Number.isNaN(due.getTime())) {
      throw new GraphQLError("Invalid due date");
    }

    if (Number.isNaN(paid.getTime())) {
      throw new GraphQLError("Invalid payment date");
    }

    let status = PaymentStatus.PARTIAL;

    if (paidAmount === amount) {
      status = PaymentStatus.PAID;
    }

    const payment = paymentRepo.create({
      tenantId,
      month,
      year,
      amount,
      paidAmount,
      dueDate: due,
      paymentDate: paid,
      paymentMode,
      status,
      receiptUrl: null,
    });

    const savedPayment = await paymentRepo.save(payment);

    return {
      message: "Rent payment created successfully",
      payment: savedPayment,
    };
  } catch (error) {
    throw new GraphQLError("Failed to create rent payment");
  }
};

export const updateRentPayment = async (
  paymentId: string,
  paidAmount: number,
  paymentDate: string,
  paymentMode: PaymentMode,
) => {
  try {
    if (
      !paymentId ||
      paidAmount === undefined ||
      !paymentDate ||
      !paymentMode
    ) {
      throw new GraphQLError("All payment fields are required");
    }

    if (paidAmount <= 0) {
      throw new GraphQLError("Paid amount must be greater than 0");
    }

    const payment = await paymentRepo.findOne({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      throw new GraphQLError("Payment not found");
    }

    const totalPaid = Number(payment.paidAmount) + paidAmount;

    if (totalPaid > Number(payment.amount)) {
      throw new GraphQLError("Paid amount cannot be greater than rent amount");
    }

    const date = new Date(paymentDate);

    if (Number.isNaN(date.getTime())) {
      throw new GraphQLError("Invalid payment date");
    }

    payment.paidAmount = totalPaid;
    payment.paymentDate = date;
    payment.paymentMode = paymentMode;

    if (totalPaid === Number(payment.amount)) {
      payment.status = PaymentStatus.PAID;
    } else {
      payment.status = PaymentStatus.PARTIAL;
    }

    const updatedPayment = await paymentRepo.save(payment);

    return {
      message: "Rent payment updated successfully",
      payment: updatedPayment,
    };
  } catch (error) {
    throw new GraphQLError("Failed to update rent payment");
  }
};

export const getAllRentPayments = async () => {
  try {
    const payments = await paymentRepo.find({
      relations: {
        tenant: {
          user: true,
          pg: true,
          room: true,
        },
      },
      order: {
        dueDate: "DESC",
      },
    });

    return payments;
  } catch (error) {
    throw new GraphQLError("Failed to fetch rent payments");
  }
};

export const getAdminRentSummary = async (
  month: string,
  year: number,
) => {
  try {
    const pgs = await pgRepo.find({
      relations: {
        rooms: true,
      },
    });

    const payments = await paymentRepo.find({
      where: {
        month,
        year,
      },
      relations: {
        tenant: {
          pg: true,
        },
      },
    });

    return pgs.map((pg) => {
      const totalRooms = pg.rooms.length;

      const occupiedRooms = pg.rooms.filter(
        (room) => room.occupiedNo > 0,
      ).length;

      const totalRent = pg.rooms.reduce(
        (total, room) => {
          return total + Number(room.monthlyRent) * room.occupiedNo;
        },
        0,
      );

      const pgPayments = payments.filter(
        (payment) => payment.tenant.pgId === pg.id,
      );

      const paidRent = pgPayments.reduce(
        (total, payment) => {
          return total + Number(payment.paidAmount);
        },
        0,
      );

      const dueRent = Math.max(
        totalRent - paidRent,
        0,
      );

      return {
        pgId: pg.id,
        pgName: pg.name,
        totalRooms,
        occupiedRooms,
        totalRent,
        paidRent,
        dueRent,
      };
    });
  } catch (error) {
    throw new GraphQLError(
      "Failed to fetch rent summary",
    );
  }
};