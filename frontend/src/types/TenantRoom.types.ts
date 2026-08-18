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

export interface GetTenantRoomQuery {
  getTenantPgRoom: TenantPgRoomResponse;
}

export interface GetTenantRoomQueryVariables {
  userId: string;
}