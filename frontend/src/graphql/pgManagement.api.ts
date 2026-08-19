import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  CreatePgResponse,
  GetAllPgsRoomsResponse,
  UpdatePgResponse,
  UpdatePgVariables,
  CreatePgVariables,
  GetAllPgsResponse,
} from "../types/PgManagement.types";

export const GET_ALL_PGS_ROOMS: TypedDocumentNode<
  GetAllPgsRoomsResponse,
  {
    input: {
      page: number;
      limit: number;
    };
  }
> = gql`
  query GetAllPgsRooms($input: PgPaginationInput) {
    getAllPgsRooms(input: $input) {
      items {
        id
        name
        address
        city
        state
        pincode
        contactNo
        description
        isActive
        createdAt
        updatedAt
        rooms {
          id
          pgId
          roomNo
          floor
          capacity
          occupiedNo
          monthlyRent
          status
          createdAt
          updatedAt
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const CREATE_PG: TypedDocumentNode<CreatePgResponse, CreatePgVariables> =
  gql`
    mutation CreatePg($input: CreatePgInput!) {
      createPg(input: $input) {
        message
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
          createdAt
          updatedAt
        }
      }
    }
  `;

export const UPDATE_PG: TypedDocumentNode<UpdatePgResponse, UpdatePgVariables> =
  gql`
    mutation UpdatePg($pgId: String!, $input: UpdatePgInput!) {
      updatePg(pgId: $pgId, input: $input) {
        message
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
          createdAt
          updatedAt
        }
      }
    }
  `;

export const GET_ALL_PGS:TypedDocumentNode<GetAllPgsResponse> = gql`
  query GetAllPgs {
    getAllPgs {
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
