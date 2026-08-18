import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetAllTenantsResponse,
  CreateTenantResponse,
  CreateTenantVariables,
  UpdateTenantResponse,
  UpdateTenantVariables,
  GetAllUsersResponse,
  GetAllPgsRoomsResponse,
} from "../types/TenantManagement.types";

export const GET_ALL_TENANTS: TypedDocumentNode<
  GetAllTenantsResponse,
  {
    page: number;
    limit: number;
  }
> = gql`
  query GetAllTenants($page: Int!, $limit: Int!) {
    getAllTenants(page: $page, limit: $limit) {
      items {
        id
        userId
        pgId
        roomId
        joiningDate
        status
        createdAt
        updatedAt

        user {
          id
          name
          email
          role
          phone
          isActive
        }

        pg {
          id
          name
          address
          city
          state
          pincode
          contactNo
          description
          isActive
        }

        room {
          id
          pgId
          roomNo
          floor
          capacity
          occupiedNo
          monthlyRent
          status
        }
      }

      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ALL_USERS: TypedDocumentNode<GetAllUsersResponse> = gql`
  query GetAllUsers {
    allUsers {
      id
      name
      email
      phone
      role
      isActive
    }
  }
`;

export const GET_ALL_PGS_ROOMS: TypedDocumentNode<GetAllPgsRoomsResponse> = gql`
  query GetAllPgsRooms {
    getAllPgsRooms {
      id
      name
      city
      state
      isActive

      rooms {
        id
        pgId
        roomNo
        floor
        capacity
        occupiedNo
        monthlyRent
        status
      }
    }
  }
`;

export const CREATE_TENANT: TypedDocumentNode<
  CreateTenantResponse,
  CreateTenantVariables
> = gql`
  mutation CreateTenant($input: CreateTenantInput!) {
    createTenant(input: $input) {
      message

      tenant {
        id
        userId
        pgId
        roomId
        joiningDate
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_TENANT: TypedDocumentNode<
  UpdateTenantResponse,
  UpdateTenantVariables
> = gql`
  mutation UpdateTenant($input: UpdateTenantInput!) {
    updateTenant(input: $input) {
      message

      tenant {
        id
        userId
        pgId
        roomId
        joiningDate
        status
        createdAt
        updatedAt
      }
    }
  }
`;
