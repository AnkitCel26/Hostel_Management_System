import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  CreateRoomResponse,
  CreateRoomVariables,
  GetAllRoomsResponse,
  GetAllRoomsVariables,
  UpdateRoomResponse,
  UpdateRoomVariables,
} from "../types/RoomManagement.types";

export const GET_ALL_ROOMS: TypedDocumentNode<
  GetAllRoomsResponse,
  GetAllRoomsVariables
> = gql`
  query GetAllRooms($page: Int!, $limit: Int!, $search: String) {
    getAllRooms(page: $page, limit: $limit, search: $search) {
      items {
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
        pg {
          id
          name
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const CREATE_ROOM: TypedDocumentNode<
  CreateRoomResponse,
  CreateRoomVariables
> = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      message
      room {
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
  }
`;

export const UPDATE_ROOM: TypedDocumentNode<
  UpdateRoomResponse,
  UpdateRoomVariables
> = gql`
  mutation UpdateRoom($roomId: String!, $input: UpdateRoomInput!) {
    updateRoom(roomId: $roomId, input: $input) {
      message
      room {
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
  }
`;
