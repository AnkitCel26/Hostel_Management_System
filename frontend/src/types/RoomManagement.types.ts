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
  pg?: {
    id: string;
    name: string;
  };
}

export interface GetAllRoomsResponse {
  getAllRooms: {
    items: Room[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetAllRoomsVariables {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateRoomInput {
  pgId: string;
  roomNo: number;
  floor: number;
  capacity: number;
  occupiedNo: number;
  monthlyRent: number;
}

export interface CreateRoomVariables {
  input: CreateRoomInput;
}

export interface CreateRoomResponse {
  createRoom: {
    message: string;
    room: Room;
  };
}

export interface UpdateRoomInput {
  occupiedNo?: number;
  monthlyRent?: number;
  status?: string;
}

export interface UpdateRoomVariables {
  roomId: string;
  input: UpdateRoomInput;
}

export interface UpdateRoomResponse {
  updateRoom: {
    message: string;
    room: Room;
  };
}
