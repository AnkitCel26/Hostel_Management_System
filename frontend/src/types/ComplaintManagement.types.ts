export type ComplaintStatus = "open" | "in_progress" | "resolved" | "closed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
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

export interface AdminComplaintTenant {
  id: string;
  user: User;
  pg: Pg;
  room: Room | null;
}

export interface AdminComplaint {
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
  tenant: AdminComplaintTenant;
}

export interface GetAllComplaintsQuery {
  getAllComplaints: AdminComplaint[];
}

export interface UpdateComplaintInput {
  status: ComplaintStatus;
}

export interface UpdateComplaintMutationVariables {
  complaintId: string;
  input: UpdateComplaintInput;
}

export interface UpdateComplaintResponse {
  message: string;
  complaint: AdminComplaint;
}

export interface UpdateComplaintMutation {
  updateComplaint: UpdateComplaintResponse;
}
