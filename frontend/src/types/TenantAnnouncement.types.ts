export interface Announcement {
  id: string;
  pgId: string;
  createdBy: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetTenantAnnouncementsQuery {
  getTenantPgAnnouncements: Announcement[];
}