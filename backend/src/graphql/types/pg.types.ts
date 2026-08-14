export interface CreatePgInput {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNo: string;
  description: string;
}

export interface CreatePgArgs {
  input: CreatePgInput;
}

export interface UpdatePgArgs {
  pgId: string;
  input: {
    contactNo?: string;
    address?: string;
    description?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isActive?: boolean;
  };
}



