import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  LoginUserInput,
  LoginUserResponse,
  RegisterUserInput,
  RegisterUserResponse,
  LogoutUserResponse,
  RefreshTokenResponse,
} from "../types/auth.types";

type LoginVariables = {
  input: LoginUserInput;
};

type RegisterVariables = {
  input: RegisterUserInput;
};

export const LOGIN_USER: TypedDocumentNode<
  LoginUserResponse,
  LoginVariables
> = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      message
      user {
        id
        name
        email
        role
        phone
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_USER: TypedDocumentNode<
  RegisterUserResponse,
  RegisterVariables
> = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      message
      user {
        id
        name
        email
        role
        phone
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGOUT_USER: TypedDocumentNode<
  LogoutUserResponse,
  Record<string, never>
> = gql`
  mutation LogoutUser {
    logoutUser {
      message
    }
  }
`;

export const REFRESH_TOKEN: TypedDocumentNode<
  RefreshTokenResponse,
  Record<string, never>
> = gql`
  mutation RefreshToken {
    refreshToken {
      message
    }
  }
`;