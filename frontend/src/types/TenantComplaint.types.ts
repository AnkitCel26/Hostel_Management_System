export type ComplaintStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

export interface Complaint {
  id: string;
  tenantId: string;
  pgId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  documentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  documentUrl?: string;
}

export interface ComplaintResponse {
  message: string;
  complaint: Complaint;
}

export interface GetTenantComplaintsData {
  getTenantComplaints: Complaint[];
}

export interface CreateComplaintData {
  createComplaint: ComplaintResponse;
}

export interface CreateComplaintVariables {
  input: CreateComplaintInput;
}