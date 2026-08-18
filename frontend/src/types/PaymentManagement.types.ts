export type PaymentMode = "cash" | "upi" | "card";

export type PaymentStatus =
  | "pending"
  | "partial"
  | "paid"
  | "overdue";

export interface AdminRentSummary {
  pgId: string;
  pgName: string;
  totalRooms: number;
  occupiedRooms: number;
  totalRent: number;
  paidRent: number;
  dueRent: number;
}

export interface AdminTenantUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AdminTenantPg {
  id: string;
  name: string;
}

export interface AdminTenantRoom {
  id: string;
  roomNo: number;
  floor: number;
}

export interface AdminTenant {
  id: string;
  user: AdminTenantUser;
  pg: AdminTenantPg;
  room: AdminTenantRoom | null;
}

export interface AdminRentPayment {
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
  tenant: AdminTenant;
}

export interface GetAdminRentSummaryResponse {
  getAdminRentSummary: AdminRentSummary[];
}

export interface GetAdminRentSummaryVariables {
  month: string;
  year: number;
}

export interface GetAllRentPaymentsResponse {
  getAllRentPayments: AdminRentPayment[];
}

export interface UpdateRentPaymentInput {
  paidAmount: number;
  paymentDate: string;
  paymentMode: PaymentMode;
}

export interface UpdateRentPaymentVariables {
  paymentId: string;
  input: UpdateRentPaymentInput;
}

export interface UpdateRentPaymentResponse {
  updateRentPayment: {
    message: string;
    payment: AdminRentPayment;
  };
}