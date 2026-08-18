export type ComplaintStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

export type PaymentMode = "cash" | "upi" | "card";

export type PaymentStatus = "partial" | "paid";

export interface Tenant {
  id: string;
  userId: string;
  pgId: string;
  roomId: string | null;
  joiningDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pg {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNo: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  pgId: string;
  roomNo: number;
  floor: number;
  capacity: number;
  occupiedNo: number;
  monthlyRent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantPgRoomResponse {
  message: string;
  tenant: Tenant;
  pg: Pg;
  room: Room;
}

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

export interface Complaint {
  id: string;
  tenantId: string;
  pgId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  documentUrl: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface Announcement {
  id: string;
  pgId: string;
  createdBy: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetTenantDashboardQuery {
  getTenantPgRoom: TenantPgRoomResponse;
  getRentPaymentHistory: TenantRentPaymentResponse;
  getTenantComplaints: Complaint[];
  getTenantPgAnnouncements: Announcement[];
}

export interface GetTenantDashboardQueryVariables {
  userId: string;
}