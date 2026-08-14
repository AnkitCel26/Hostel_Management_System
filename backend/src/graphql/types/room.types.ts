export interface CreateRoomInput {
  pgId: string;
  roomNo: number;
  floor: number;
  capacity: number;
  occupiedNo: number;
  monthlyRent: number;
}

export interface CreateRoomArgs {
  input: CreateRoomInput;
}

export interface UpdateRoomArgs {
  roomId: string;
  input: {
    occupiedNo?: string;
    monthlyRent?: string;
    status?: string;
  };
}
