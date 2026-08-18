export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MeQuery {
  me: User | null;
};

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  loginUser: {
    message: string;
    user: User;
  };
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

export interface RegisterUserResponse {
  registerUser: {
    message: string;
    user: User;
  };
}

export interface LogoutUserResponse {
  logoutUser: {
    message: string;
  };
}
export interface RefreshTokenResponse {
  refreshToken: {
    message: string;
  };
}