export type PaymentMode = "cash" | "upi" | "card";

export type PaymentStatus = "partial" | "paid";

export interface RentPayment {
  id: string;
  tenantId: string;
  month: string;
  year: number;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paymentDate: string | null;
  paymentMode: PaymentMode | null;
  receiptUrl: string | null;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TenantRentPaymentResponse {
  message: string;
  monthlyRent: number;
  paymentHistory: RentPayment[];
}

export interface TenantInfo {
  id: string;
}

export interface TenantPgRoomResponse {
  tenant: TenantInfo;
}

export interface GetRentPaymentHistoryQuery {
  getTenantPgRoom: TenantPgRoomResponse;
  getRentPaymentHistory: TenantRentPaymentResponse;
}

export interface GetRentPaymentHistoryQueryVariables {
  userId: string;
}

export interface CreateRentPaymentInput {
  tenantId: string;
  month: string;
  year: number;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paymentDate: string;
  paymentMode: PaymentMode;
}

export interface CreateRentPaymentResponse {
  message: string;
  payment: RentPayment;
}

export interface CreateRentPaymentMutation {
  createRentPayment: CreateRentPaymentResponse;
}

export interface CreateRentPaymentMutationVariables {
  input: CreateRentPaymentInput;
}