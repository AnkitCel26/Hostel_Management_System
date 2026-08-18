export interface Room {
  id: string;
  pgId: string;
  roomNo: number;
  floor: number | null;
  capacity: number;
  occupiedNo: number;
  monthlyRent: number;
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

export interface AllPgs extends Pg {
  rooms: Room[];
}

export interface CreatePgInput {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNo: string;
  description: string;
}

export interface UpdatePgInput {
  address?: string;
  contactNo?: string;
  description?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isActive?: boolean;
}

export interface CreatePgVariables {
  input: CreatePgInput;
}

export interface UpdatePgVariables {
  pgId: string;
  input: UpdatePgInput;
}

export interface GetAllPgsRoomsResponse {
  getAllPgsRooms: {
    items: AllPgs[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePgResponse {
  createPg: {
    message: string;
    pg: Pg;
  };
}

export interface UpdatePgResponse {
  updatePg: {
    message: string;
    pg: Pg;
  };
}
