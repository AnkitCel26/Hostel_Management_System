export interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
}

export interface TenantPg {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNo: string;
  description: string | null;
  isActive: boolean;
}

export interface TenantRoom {
  id: string;
  pgId: string;
  roomNo: number;
  floor: number;
  capacity: number;
  occupiedNo: number;
  monthlyRent: number;
  status: string;
}

export interface AllTenant {
  id: string;
  userId: string;
  pgId: string;
  roomId: string | null;
  joiningDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: TenantUser;
  pg: TenantPg;
  room: TenantRoom | null;
}

export interface GetAllTenantsResponse {
  getAllTenants: AllTenant[];
}

export interface CreateTenantInput {
  userId: string;
  pgId: string;
  roomId?: string | null;
  joiningDate: string;
}

export interface CreateTenantVariables {
  input: CreateTenantInput;
}

export interface CreateTenantResponse {
  createTenant: {
    message: string;
    tenant: AllTenant;
  };
}

export interface UpdateTenantInput {
  tenantId: string;
  joiningDate?: string;
  status?: string;
  roomId?: string | null;
}

export interface UpdateTenantVariables {
  input: UpdateTenantInput;
}

export interface UpdateTenantResponse {
  updateTenant: {
    message: string;
    tenant: AllTenant;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

export interface GetAllUsersResponse {
  allUsers: AdminUser[];
}

export interface AdminRoom {
  id: string;
  pgId: string;
  roomNo: number;
  floor: number;
  capacity: number;
  occupiedNo: number;
  monthlyRent: number;
  status: string;
}

export interface AdminPg {
  id: string;
  name: string;
  city: string;
  state: string;
  isActive: boolean;
  rooms: AdminRoom[];
}

export interface GetAllPgsRoomsResponse {
  getAllPgsRooms: AdminPg[];
}