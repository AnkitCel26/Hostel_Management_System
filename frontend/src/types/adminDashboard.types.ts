export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
}

export interface Room {
  id: string;
  pgId: string;
  roomNo: number;
  floor: number | null;
  capacity: number;
  occupiedNo: number;
  monthlyRent: number;
  status: string;
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
  rooms: Room[];
}

export interface DashboardResponse {
  allUsers: User[];
  getAllPgsRooms: Pg[];
}