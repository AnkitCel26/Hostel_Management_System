import type { TenantStatus } from "../../entities/tenant.entity.ts";

export interface CreateTenantInput {
  userId: string;
  pgId: string;
  roomId: string;
  joiningDate: string;
}

export interface CreateTenantArgs {
  input: CreateTenantInput;
}

export interface UpdateTenantArgs {
  input: {
    tenantId: string;
    joiningDate?: string;
    status?: TenantStatus;
    roomId?: string;
  };
}