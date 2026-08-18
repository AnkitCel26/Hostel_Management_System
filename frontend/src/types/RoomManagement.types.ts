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
  rooms: Room[];
}

export interface GetAllPgsRoomsResponse {
  getAllPgsRooms: Pg[];
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