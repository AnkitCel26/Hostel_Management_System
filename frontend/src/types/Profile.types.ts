export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileInput {
  name?: string;
  phone?: string;
}

export interface UpdateUserProfileMutation {
  updateProfile: {
    message: string;
    user: UserProfile;
  };
}

export interface UpdateUserProfileMutationVariables {
  input: UpdateUserProfileInput;
}