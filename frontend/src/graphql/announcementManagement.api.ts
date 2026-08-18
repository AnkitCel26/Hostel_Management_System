import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetAllAnnouncementsQuery,
  CreateAnnouncementMutation,
  CreateAnnouncementMutationVariables,
  UpdateAnnouncementMutation,
  UpdateAnnouncementMutationVariables,
  GetAllPgsRoomsQuery,
} from "../types/AnnouncementManagement.types";

export const GET_ALL_ANNOUNCEMENTS: TypedDocumentNode<GetAllAnnouncementsQuery> = gql`
  query GetAllAnnouncements {
    getAllAnnouncements {
      id
      pgId
      createdBy
      title
      content
      isActive
      createdAt
      updatedAt
      pg {
        name
      }
    }
  }
`;

export const GET_ALL_PGS: TypedDocumentNode<GetAllPgsRoomsQuery> = gql`
  query GetAllPgsRooms {
    getAllPgsRooms {
      id
      name
    }
  }
`;

export const CREATE_ANNOUNCEMENT: TypedDocumentNode<
  CreateAnnouncementMutation,
  CreateAnnouncementMutationVariables
> = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      message
      announcement {
        id
        pgId
        createdBy
        title
        content
        isActive
        createdAt
        updatedAt
        pg {
          name
        }
      }
    }
  }
`;

export const UPDATE_ANNOUNCEMENT: TypedDocumentNode<
  UpdateAnnouncementMutation,
  UpdateAnnouncementMutationVariables
> = gql`
  mutation UpdateAnnouncement(
    $announcementId: ID!
    $input: UpdateAnnouncementInput!
  ) {
    updateAnnouncement(announcementId: $announcementId, input: $input) {
      message
      announcement {
        id
        pgId
        createdBy
        title
        content
        isActive
        createdAt
        updatedAt
        pg {
          name
        }
      }
    }
  }
`;
