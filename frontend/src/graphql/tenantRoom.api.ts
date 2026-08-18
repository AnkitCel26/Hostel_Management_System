import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetTenantRoomQuery,
  GetTenantRoomQueryVariables,
} from "../types/TenantRoom.types";

export const GET_TENANT_ROOM: TypedDocumentNode<
  GetTenantRoomQuery,
  GetTenantRoomQueryVariables
> = gql`
  query GetTenantRoom($userId: ID!) {
    getTenantPgRoom(userId: $userId) {
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