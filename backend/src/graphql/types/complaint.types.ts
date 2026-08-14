import type { ComplaintStatus } from "../../entities/complaint.entity.ts";

export interface CreateComplaintInput {
  tenantId: string;
  title: string;
  description: string;
  documentUrl?: string;
}

export interface CreateComplaintArgs {
  input: CreateComplaintInput;
}

export interface UpdateComplaintArgs {
  complaintId: string;
  input: {
    status: ComplaintStatus;
  };
}
