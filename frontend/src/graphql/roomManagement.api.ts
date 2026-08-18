import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetAllPgsRoomsResponse,
  CreateRoomResponse,
  CreateRoomVariables,
  UpdateRoomResponse,
  UpdateRoomVariables,
} from "../types/RoomManagement.types";

export const GET_ALL_PGS_ROOMS: TypedDocumentNode<
  GetAllPgsRoomsResponse
> = gql`
  query GetAllPgsRooms {
    getAllPgsRooms {
      id
      name
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
  mutation UpdateRoom(
    $roomId: String!
    $input: UpdateRoomInput!
  ) {
    updateRoom(
      roomId: $roomId
      input: $input
    ) {
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