import { gql, type TypedDocumentNode } from "@apollo/client";

import type {
  GetTenantAnnouncementsQuery,
} from "../types/TenantAnnouncement.types";

export const GET_TENANT_ANNOUNCEMENTS: TypedDocumentNode<
  GetTenantAnnouncementsQuery,
  Record<string, never>
> = gql`
  query GetTenantAnnouncements {
    getTenantPgAnnouncements {
      id
      pgId
      createdBy
      title
      content
      isActive
      createdAt
      updatedAt
    }
  }
`;