import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetAllAnnouncementsQuery,
  CreateAnnouncementMutation,
  CreateAnnouncementMutationVariables,
  UpdateAnnouncementMutation,
  UpdateAnnouncementMutationVariables,
  GetAllAnnouncementsQueryVariables,
} from "../types/AnnouncementManagement.types";

export const GET_ALL_ANNOUNCEMENTS: TypedDocumentNode<
  GetAllAnnouncementsQuery,
  GetAllAnnouncementsQueryVariables
> = gql`
  query GetAllAnnouncements(
    $page: Int!
    $limit: Int!
  ) {
    getAllAnnouncements(
      page: $page
      limit: $limit
    ) {
      items {
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
      total
      page
      limit
      totalPages
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
