import type { PaymentMode } from "../../entities/rent_payment.entity.ts";

export interface CreateRentPaymentArgs {
  input: {
    tenantId: string;
    month: string;
    year: number;
    amount: number;
    paidAmount: number;
    dueDate: string;
    paymentDate: string;
    paymentMode: PaymentMode;
  };
}

export interface UpdateRentPaymentArgs {
  paymentId: string;
  input: {
    paidAmount: number;
    paymentDate: string;
    paymentMode: PaymentMode;
  };
}

export interface AdminRentSummary {
  pgId: string;
  pgName: string;
  totalRooms: number;
  occupiedRooms: number;
  totalRent: number;
  paidRent: number;
  dueRent: number;
}

export interface GetAdminRentSummaryArgs {
  month: string;
  year: number;
}
