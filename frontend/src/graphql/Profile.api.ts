import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";

import type {
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables,
} from "../types/Profile.types";
import type { MeQuery } from "../types/auth.types";

export const UPDATE_PROFILE: TypedDocumentNode<
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables
> = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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
export const ME: TypedDocumentNode<
  MeQuery,
  Record<string, never>
> = gql`
  query Me {
    me {
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
`;