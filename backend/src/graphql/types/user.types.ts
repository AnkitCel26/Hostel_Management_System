export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

export interface RegisterUserArgs {
  input: RegisterUserInput;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserArgs {
  input: LoginUserInput;
}

export interface UpdateProfileArgs {
  input: {
    name?: string;
    phone?: string;
  };
}